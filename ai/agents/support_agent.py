from ai.schemas.support_tools_schemas import ORDER_TOOL_SCHEMA
from ai.tools.order_tools import (
    get_tracking_history, 
    get_return_status, 
    get_refund_status, 
    get_order_details,
    get_tracking_status,
    get_user_orders,
    cancel_order,
    cancel_return_request,
    check_return_eligibility,
    create_return_request,
)

from openai import OpenAI
from django.conf import settings
from decouple import config
from ai.models import Conversation, Message, AgentLog, Agent
from ai.prompts.support_prompts import SUPPORT_AGENT_PROMPT
import json


def execute_tool(tool_name, tool_input, user_id, conversation_id=None):

    try:
        tool_input = json.loads(tool_input)

        if tool_name == "get_tracking_history":
            return get_tracking_history(
                user_id=user_id,
                order_id=tool_input.get("order_id")
            )

        elif tool_name == "get_return_status":
            return get_return_status(
                user_id=user_id,
                order_id=tool_input.get("order_id")
            )

        elif tool_name == "get_user_orders":
            return get_user_orders(
                user_id=user_id
            )

        elif tool_name == "get_order_details":
            return get_order_details(
                user_id=user_id,
                order_id=tool_input.get("order_id")
            )

        elif tool_name == "get_tracking_status":
            return get_tracking_status(
                user_id=user_id,
                order_id=tool_input.get("order_id")
            )

        elif tool_name == "check_return_eligibility":
            return check_return_eligibility(
                user_id=user_id,
                order_id=tool_input.get("order_id"),
                book_id=tool_input.get("book_id"),
                reason=tool_input.get("reason")
            )

        elif tool_name == "get_refund_status":
            return get_refund_status(
                user_id=user_id,
                order_id=tool_input.get("order_id")
            )

        elif tool_name == "create_return_request":
            return create_return_request(
                user_id=user_id,
                order_id=tool_input.get("order_id"),
                book_id=tool_input.get("book_id"),
                quantity=tool_input.get("quantity"), 
                reason=tool_input.get("reason")
            )

        elif tool_name == "cancel_return_request":
            return cancel_return_request(
                user_id=user_id,
                return_id=tool_input.get("return_id")
            )

        elif tool_name == "cancel_order":
            return cancel_order(
                user_id=user_id,
                order_id=tool_input.get("order_id")
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

def run_support_agent(user_message, conversation_id, user_id):
    print("user_message==========>", user_message)

    try:
        conversation = Conversation.objects.get(
            id=conversation_id,
            user_id=user_id
        )
    except Conversation.DoesNotExist:
        return {
            "success":False,
            "message":"Conversation not found"
        }

    Message.objects.create(
        conversation=conversation,
        role="user",
        content=user_message
    )

    AgentLog.objects.create(
        conversation=conversation,
        event_type="agent_start",
        message=f"Support agent started for user {user_id}"
    )

    last_messages = (
        conversation.messages
        .exclude(role="tool")
        .order_by("-created_at")[:10]
    )

    conversation_messages = [
        {
        "role":message.role,
        "content":message.content
        }for message in reversed(last_messages)
    ]

    messages = [
        {
            "role":"system",
            "content": SUPPORT_AGENT_PROMPT
        },
        *conversation_messages,
        
    ]

    while True:

        try:
            response = client.chat.completions.create(
                model=conversation.agent.model,
                messages=messages,
                tools=ORDER_TOOL_SCHEMA,
                temperature=0.2
            )
        except Exception as e:
            AgentLog.objects.create(
                conversation=conversation,
                event_type="error",
                message=str(e)
            )

            return {
                "success":False,
                "error":"Agent failed to process the request"
            }

        assistant_message = response.choices[0].message

        if not assistant_message.tool_calls:

            final_reply = assistant_message.content or ""
            print("final_reply===>", final_reply)

            Message.objects.create(
                conversation=conversation,
                role="assistant",
                content=final_reply
            )

            AgentLog.objects.create(
                conversation=conversation,
                event_type="agent_end",
                message="Support agent completed successfully"
            )

            return {
                "success":True,
                "reply":final_reply
            }

        messages.append(
            {
                "role":"assistant",
                "content":assistant_message.content or "",
                "tool_calls":[
                    {
                        "id":tool_call.id,
                        "type":"function",
                        "function": {
                            "name":tool_call.function.name,
                            "arguments":tool_call.function.arguments,
                        },

                    }
                    for tool_call in assistant_message.tool_calls
                ],

            }
        )

        for tool_call in assistant_message.tool_calls:
            tool_name = tool_call.function.name
            tool_arguments = tool_call.function.arguments

            AgentLog.objects.create(
                conversation=conversation,
                event_type="tool_call",
                message=(
                    f"Calling tool : {tool_name}\n"
                    f"Arguments : {tool_arguments}"
                )
            )

            result = execute_tool(
                tool_name=tool_name,
                tool_input=tool_arguments,
                conversation_id=conversation_id,
                user_id=user_id
            )

            if not isinstance(result, str):
                result = json.dumps(result)

            AgentLog.objects.create(
                conversation=conversation,
                event_type = "tool_result",
                message=(
                    f"Tool : {tool_name}\n"
                    f"Result : {result}"
                )
            )

            messages.append(
                {
                    "role":"tool",
                    "tool_call_id":tool_call.id,
                    "content": result
                }
            )