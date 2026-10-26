import json
from openai import OpenAI
from django.conf import settings
from .recommendation_agent import run_recommendation_agent
from .shopping_agent import run_shopping_agent
from .support_agent import run_support_agent
from ai.models import Conversation
from ai.prompts.orchestrator_prompt import ORCHESTRATOR_PROMPT
from ai.schemas.orchestrator_tool_schemas import AGENT_TOOLS

client = OpenAI(
    api_key=settings.OPENROUTER_API_KEY,
    base_url=settings.BASE_URL,
)

MODEL = "openai/gpt-4o-mini"


def execute_agent_tool(
    tool_name,
    arguments,
    user_id,
    conversation_id,
):
    """
    Execute a specialist agent.

    user_id comes from the authenticated Django request.
    It never comes from LLM-generated arguments.
    """

    task = arguments["task"]
    context = arguments.get("context", {})

    # Supply previous results as structured context to the agent.
    task_message = (
        f"Current task:\n{task}\n\n"
        f"Context from previous tasks:\n"
        f"{json.dumps(context, ensure_ascii=False, default=str)}"
    )

    if tool_name == "call_shopping_agent":
        result = run_shopping_agent(
            user_message=task_message,
            conversation_id=conversation_id,
            user_id=user_id,
        )
        print(result)

    elif tool_name == "call_support_agent":
        result = run_support_agent(
            user_message=task_message,
            conversation_id=conversation_id,
            user_id=user_id,
        )
        print(result)

    elif tool_name == "call_recommendation_agent":
        result = run_recommendation_agent(
            user_message=task_message,
            conversation_id=conversation_id,
            user_id=user_id,
        )
        print(result)

    else:
        raise ValueError("Unknown specialist agent.")

    # Preserve structured results when the agent returns a dictionary.
    return result


def run_orchestrator(
    user_message,
    conversation_id,
    user_id,
):
    """
    Plan and execute tasks using specialist agents.
    Returns one final response for the user.
    """

    # Verify that this conversation belongs to the authenticated user.
    conversation = Conversation.objects.get(
        id=conversation_id,
        user_id=user_id,
    )

    # Load recent conversation history once for the orchestrator.
    messages = conversation.messages.exclude(
        role="tool"
    ).order_by("-created_at")[:10]

    history = []

    for message in reversed(list(messages)):
        # The API may already have saved the current user message.
        # Avoid adding it twice to the orchestrator's history.
        if (
            message.role == "user"
            and message.content == user_message
        ):
            continue

        if message.role in ("user", "assistant"):
            history.append({
                "role": message.role,
                "content": message.content,
            })

    # Keep the current request separate from previous history.
    history.append({
        "role": "user",
        "content": user_message,
    })

    # Keep this request's tool results in the orchestrator's own
    # working context. Do not confuse them with user messages.
    for _ in range(8):
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": ORCHESTRATOR_PROMPT,
                },
                *history,
            ],
            tools=AGENT_TOOLS,
            tool_choice="auto",
            parallel_tool_calls=False,
        )

        assistant_message = response.choices[0].message

        # No more tool calls: the orchestrator has its final answer.
        if not assistant_message.tool_calls:
            return {
                "success": True,
                "reply": assistant_message.content or (
                    "I couldn't prepare a response. Please try again."
                ),
            }

        # Add the assistant's tool-call message to the LLM context.
        history.append(
            assistant_message.model_dump(exclude_none=True)
        )

        # Execute one specialist call, then let the orchestrator
        # inspect its result before deciding the next step.
        tool_call = assistant_message.tool_calls[0]

        
        # Process every tool call returned by the model.
        # Each tool_call_id must receive a matching tool response.
        for tool_call in assistant_message.tool_calls:
            try:
                arguments = json.loads(
                    tool_call.function.arguments
                )

                result = execute_agent_tool(
                    tool_name=tool_call.function.name,
                    arguments=arguments,
                    user_id=user_id,
                    conversation_id=conversation_id,
                )

                tool_result = json.dumps(
                    result,
                    ensure_ascii=False,
                    default=str,
                )

            except Exception:
                # Log the full exception on the server when debugging.
                tool_result = json.dumps({
                    "success": False,
                    "error": "The specialist task failed.",
                })

            # This response MUST match the current tool_call.id.
            history.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": tool_result,
            })

    return {
        "success": False,
        "reply": (
            "I couldn't complete all the requested tasks. "
            "Please try a simpler request."
        ),
    }
