
import json

from ai.tools.book_tools import (
    search_book,
    get_book_detail,
    check_book_stock,
    compare_books,
    get_recommendations,
)
from openai import OpenAI
from django.conf import settings
from ai.models import Conversation, Message, AgentLog, Agent
from ai.prompts.shopping_prompts import SHOPPING_AGENT_SYSTEM_PROMPT
from ai.schemas.tool_schemas import BOOK_TOOL_SCHEMA
from decouple import config

def execute_tool(tool_name, tool_input, conversation_id=None):

    try:
        # Convert JSON string into dictionary
        tool_input = json.loads(tool_input)

        if tool_name == "search_book":
            return search_book(
                query=tool_input.get("query"),
                max_price=tool_input.get("max_price"),
                category=tool_input.get("category"),
            )

        if tool_name == "get_book_detail":
            return get_book_detail(
                book_id=tool_input.get("book_id")
            )

        if tool_name == "check_book_stock":
            return check_book_stock(
                book_id=tool_input.get("book_id")
            )

        if tool_name == "compare_books":
            return compare_books(
                tool_input.get("book_ids")
            )

        if tool_name == "get_recommendations":
            return get_recommendations(
                query=tool_input.get("query"),
                max_price=tool_input.get("max_price"),
                category=tool_input.get("category"),
            )

        return {
            "success": False,
            "error": f"Unknown tool: {tool_name}"
        }

    except json.JSONDecodeError:
        return {
            "success": False,
            "error": "Invalid tool input JSON."
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

client = OpenAI(
    api_key= settings.OPENROUTER_API_KEY,
    base_url= settings.BASE_URL
)


def run_shopping_agent(user_message, conversation_id, user_id):

    # Get conversation
    try:
        conversation = Conversation.objects.get(
            id=conversation_id,
            user_id=user_id
        )
    except Conversation.DoesNotExist:
        return {
            "success": False,
            "error": "Conversation not found."
        }

    Message.objects.create(
        conversation=conversation,
        role="user",
        content=user_message
    )

    AgentLog.objects.create(
        conversation=conversation,
        event_type="agent_start",
        message=f"Shopping agent started for user {user_id}"
    )

    # Get recent conversation history
    last_messages = (
        conversation.messages
        .exclude(role="tool")
        .order_by("-created_at")[:10]
    )

    conversation_messages = [
        {
            "role": message.role,
            "content": message.content
        }
        for message in reversed(last_messages)
    ]

    # System message
    messages = [
        {
            "role": "system",
            "content": (
                f"{SHOPPING_AGENT_SYSTEM_PROMPT}\n\n"
                f"Current user ID: {user_id}"
            )
        },
        *conversation_messages,
        {
            "role": "user",
            "content": user_message
        }
    ]

    # Agent loop
    while True:

        try:
            response = client.chat.completions.create(
                model=conversation.agent.model,
                messages=messages,
                tools=BOOK_TOOL_SCHEMA,
                temperature=0.2,
            )

        except Exception as e:

            AgentLog.objects.create(
                conversation=conversation,
                event_type="error",
                message=str(e)
            )

            return {
                "success": False,
                "error": "Agent failed to process the request."
            }

        assistant_message = response.choices[0].message

        # --------------------------------
        # No tool call → final response
        # --------------------------------
        if not assistant_message.tool_calls:

            final_reply = assistant_message.content or ""
            print("finall reply=======>", final_reply)

            # Save assistant response
            Message.objects.create(
                conversation=conversation,
                role="assistant",
                content=final_reply
            )

            AgentLog.objects.create(
                conversation=conversation,
                event_type="agent_end",
                message="Shopping agent completed successfully."
            )

            return {
                "success": True,
                "reply": final_reply
            }

        # --------------------------------
        # Add assistant tool-call message
        # --------------------------------
        messages.append(
            {
                "role": "assistant",
                "content": assistant_message.content or "",
                "tool_calls": [
                    {
                        "id": tool_call.id,
                        "type": "function",
                        "function": {
                            "name": tool_call.function.name,
                            "arguments": tool_call.function.arguments,
                        },
                    }
                    for tool_call in assistant_message.tool_calls
                ],
            }
        )

        # --------------------------------
        # Execute tools
        # --------------------------------
        for tool_call in assistant_message.tool_calls:

            

            tool_name = tool_call.function.name
            tool_arguments = tool_call.function.arguments

            AgentLog.objects.create(
                conversation=conversation,
                event_type="tool_call",
                message=(
                    f"Calling tool: {tool_name}\n"
                    f"Arguments: {tool_arguments}"
                )
            )

            result = execute_tool(
                tool_name=tool_name,
                tool_input=tool_arguments,
                conversation_id=conversation_id
            )

            # Convert result to JSON string
            if not isinstance(result, str):
                result = json.dumps(result)

            AgentLog.objects.create(
                conversation=conversation,
                event_type="tool_result",
                message=(
                    f"Tool: {tool_name}\n"
                    f"Result: {result}"
                )
            )

            # Add tool result back to conversation
            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": result,
                }
            )

