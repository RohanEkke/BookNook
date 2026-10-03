ORDER_TOOL_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "get_user_orders",
            "description": "Get the authenticated customer's orders.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "get_order_details",
            "description": "Get detailed information about a specific order, including its items, address, payment status, and order status.",
            "parameters": {
                "type": "object",
                "properties": {
                    "order_id": {
                        "type": "integer",
                        "description": "The ID of the order."
                    }
                },
                "required": ["order_id"]
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "get_tracking_status",
            "description": "Get the current shipment and delivery status of a customer's order.",
            "parameters": {
                "type": "object",
                "properties": {
                    "order_id": {
                        "type": "integer",
                        "description": "The ID of the order."
                    }
                },
                "required": ["order_id"]
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "get_tracking_history",
            "description": "Get the tracking event history of a customer's order, including shipment status, location, description, and event time.",
            "parameters": {
                "type": "object",
                "properties": {
                    "order_id": {
                        "type": "integer",
                        "description": "The ID of the order."
                    }
                },
                "required": ["order_id"]
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "check_return_eligibility",
            "description": "Check whether a specific book from a customer's order is eligible for return.",
            "parameters": {
                "type": "object",
                "properties": {
                    "order_id": {
                        "type": "integer",
                        "description": "The ID of the order."
                    },
                    "book_id": {
                        "type": "integer",
                        "description": "The ID of the book the customer wants to return."
                    },
                    "reason": {
                        "type": "string",
                        "description": "The reason for the return, such as damaged, defective, wrong_item, missing_pages, or other."
                    }
                },
                "required": [
                    "order_id",
                    "book_id",
                    "reason"
                ]
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "get_return_status",
            "description": "Get the return requests and their current status for a customer's order.",
            "parameters": {
                "type": "object",
                "properties": {
                    "order_id": {
                        "type": "integer",
                        "description": "The ID of the order."
                    }
                },
                "required": ["order_id"]
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "get_refund_status",
            "description": "Get the refund status and refund details for a customer's order.",
            "parameters": {
                "type": "object",
                "properties": {
                    "order_id": {
                        "type": "integer",
                        "description": "The ID of the order."
                    }
                },
                "required": ["order_id"]
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "create_return_request",
            "description": "Create a return request for a specific book from a customer's delivered order. Use this only when the customer explicitly wants to create a return.",
            "parameters": {
                "type": "object",
                "properties": {
                    "order_id": {
                        "type": "integer",
                        "description": "The ID of the order."
                    },
                    "book_id": {
                        "type": "integer",
                        "description": "The ID of the book to return."
                    },
                    "quantity": {
                        "type": "integer",
                        "description": "The number of copies the customer wants to return."
                    },
                    "reason": {
                        "type": "string",
                        "description": "The reason for the return, such as damaged, defective, wrong_item, missing_pages, or other."
                    }
                },
                "required": [
                    "order_id",
                    "book_id",
                    "quantity",
                    "reason"
                ]
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "cancel_return_request",
            "description": "Cancel an existing return request belonging to the authenticated customer.",
            "parameters": {
                "type": "object",
                "properties": {
                    "return_id": {
                        "type": "integer",
                        "description": "The ID of the return request."
                    }
                },
                "required": ["return_id"]
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "cancel_order",
            "description": "Cancel a customer's order if the order is still in a cancellable status.",
            "parameters": {
                "type": "object",
                "properties": {
                    "order_id": {
                        "type": "integer",
                        "description": "The ID of the order to cancel."
                    }
                },
                "required": ["order_id"]
            }
        }
    }
]