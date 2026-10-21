from ai.agents.recommendation_agent import run_recommendation_agent
from ai.agents.shopping_agent import run_shopping_agent
from ai.agents.support_agent import run_support_agent
from ai.prompts.orchestrator_prompt import ORCHESTRATOR_SYSTEM_PROMPT
from openai import OpenAI
from django.conf import settings
from ai.models import Conversation, Message, AgentLog, Agent


client = OpenAI(
    api_key= settings.OPENROUTER_API_KEY,
    base_url= settings.BASE_URL
)

def route_request(user_message):

    response = client.chat.completions.create(
        model="openai/gpt-4o-mini",

        messages=[
            {
                "role": "system",
                "content": ORCHESTRATOR_SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": user_message
            }
        ],

        temperature=0
    )

    agent = response.choices[0].message.content.strip().lower()

    valid_agents = {
        "shopping",
        "support",
        "recommendation"
    }

    if agent not in valid_agents:
        return "shopping"

    return agent

def run_orchestrator(
    user_message,
    conversation_id,
    user_id
):

    agent = route_request(user_message)

    if agent == "shopping":
        return run_shopping_agent(
            user_message,
            conversation_id,
            user_id
        )

    if agent == "support":
        return run_support_agent(
            user_message,
            conversation_id,
            user_id
        )

    if agent == "recommendation":
        return run_recommendation_agent(
            user_message,
            conversation_id,
            user_id
        )

    return {
        "success": False,
        "error": "Unable to route request."
    }