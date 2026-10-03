RECOMMENDATION_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_recommendations",
            "description": "Get available books using optional genre, author, or price filters.",
            "parameters": {
                "type": "object",
                "properties": {
                    "genre": {
                        "type": "string",
                        "description": "Genre to filter by."
                    },
                    "author": {
                        "type": "string",
                        "description": "Author to filter by."
                    },
                    "max_price": {
                        "type": "number",
                        "description": "Maximum book price."
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Maximum number of books to return.",
                        "default": 5
                    }
                },
                "required": []
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "get_personalized_recommendations",
            "description": "Recommend books based on the user's last 5 orders.",
            "parameters": {
                "type": "object",
                "properties": {
                    "limit": {
                        "type": "integer",
                        "description": "Maximum number of books to return.",
                        "default": 5
                    }
                },
                "required": []
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "get_similar_books",
            "description": "Find books similar to a specific book based on shared genres.",
            "parameters": {
                "type": "object",
                "properties": {
                    "book_id": {
                        "type": "integer",
                        "description": "ID of the book to find similar books for."
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Maximum number of similar books to return.",
                        "default": 5
                    }
                },
                "required": ["book_id"]
            }
        }
    }
]