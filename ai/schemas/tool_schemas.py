BOOK_TOOL_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "search_book",
            "description": "Search the BookNook catalog for books matching the user's requirements such as title, author, topic, keywords, category, or maximum price. Use this tool when the user wants to find or browse books.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Keywords to search for in the book title, author, or description. Examples: 'Python', 'Clean Code', 'Robert Martin'."
                    },
                    "max_price": {
                        "type": "number",
                        "description": "Maximum price in INR. Returns books whose price is less than or equal to this amount. Example: 600 means books priced at ₹600 or less."
                    },
                    "category": {
                        "type": "string",
                        "description": "Book category or genre. Use ONLY one of these exact category values: 'Mystery', 'Fiction', 'Sci-Fi', 'Non-Fiction', 'Biography', 'Fantasy'. Map common user expressions to these values. For example: 'science fiction', 'sci fi', 'sci-fi' -> 'Sci-Fi'; 'mystery novels', 'detective books' -> 'Mystery'; 'fantasy novels' -> 'Fantasy'; 'true stories' or 'real life' -> 'Biography' when appropriate."
                    }
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_book_detail",
            "description": "Fetch complete book details including author, category, stock, description and price. Use this when you want the details about specific book.",
            "parameters": {
                "type": "object",
                "properties": {
                    "book_id": {
                        "type": "number",
                        "description": "The book ID to look up"
                    }
                },
                "required": ["book_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "check_book_stock",
            "description": "Fetch stock copies avaliblity when user ask about stock.",
            "parameters": {
                "type": "object",
                "properties": {
                    "book_id": {
                        "type": "number",
                        "description": "The book ID of required book stock."
                    }
                },
                "required": ["order_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "compare_books",
            "description": "Compare two or more books based on their details such as title, author, category, price, and stock. Use this tool when the user asks to compare specific books.",
            "parameters": {
                "type": "object",
                "properties": {
                    "book_ids": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        },
                        "description": "A list of book IDs to compare. Provide at least two book IDs."
                    }
                },
                "required": ["book_ids"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_recommendations",
            "description": "Recommend books from the BookNook catalog based on the user's preferences such as topic, category, or maximum price. Use this tool when the user asks for book recommendations. Only books currently in stock are returned.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Topic, title, author, or keywords describing what kind of book the user is looking for. Examples: 'Python', 'machine learning', 'fiction', 'Robert Martin'."
                    },
                    "category": {
                        "type": "string",
                        "description": "Book category or genre preferred by the user. Examples: 'Programming', 'Fiction', 'Science', 'Self Help'."
                    },
                    "max_price": {
                        "type": "number",
                        "description": "Maximum price in INR. Only recommend books priced at or below this amount. Example: 600 means the user wants books costing ₹600 or less."
                    }
                },
                "required": []
            }
        }
    }
]