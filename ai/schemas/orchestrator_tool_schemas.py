AGENT_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "call_shopping_agent",
            "description": (
                "Delegate book search, book details, stock checks "
                "or cart tasks to the shopping specialist."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "task": {
                        "type": "string",
                        "description": "The specific task to perform."
                    },
                    "context": {
                        "type": "object",
                        "description": (
                            "Relevant results or information from "
                            "previous tasks."
                        ),
                        "additionalProperties": True
                    }
                },
                "required": ["task", "context"],
                "additionalProperties": False
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "call_support_agent",
            "description": (
                "Delegate order, delivery, tracking, return, "
                "refund or cancellation tasks to the support specialist."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "task": {
                        "type": "string",
                        "description": "The specific support task."
                    },
                    "context": {
                        "type": "object",
                        "description": "Relevant previous task results.",
                        "additionalProperties": True
                    }
                },
                "required": ["task", "context"],
                "additionalProperties": False
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "call_recommendation_agent",
            "description": (
                "Delegate general, personalized or similar-book "
                "recommendations to the recommendation specialist."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "task": {
                        "type": "string",
                        "description": "The specific recommendation task."
                    },
                    "context": {
                        "type": "object",
                        "description": "Relevant previous task results.",
                        "additionalProperties": True
                    }
                },
                "required": ["task", "context"],
                "additionalProperties": False
            }
        }
    }
]