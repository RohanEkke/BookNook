import React, { useEffect, useRef, useState } from "react";
import axiosInstance from '../../axiosInstance';
import ReactMarkdown from "react-markdown";

const ChatAI = () => {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hello! 👋 I'm BookNook AI. I can help you find books, compare books, check availability, and recommend books."
        }
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages, loading]);

    const sendMessage = async (e) => {
        e.preventDefault();

        const message = input.trim();

        if (!message || loading) return;

        // Show user message immediately
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: message
            }
        ]);

        setInput("");
        setLoading(true);

        try {
            const response = await axiosInstance.post("/chat/", {
                message: message,
                conversation_id: conversationId
            });

            const data = response.data;

            if (data.conversation_id) {
                setConversationId(data.conversation_id);
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.reply
                }
            ]);

        } catch (error) {
            console.error("AI Error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry, something went wrong. Please try again."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const sendSuggestion = (text) => {
        setInput(text);
    };

    const newChat = () => {
        setMessages([
            {
                role: "assistant",
                content:
                    "Hello! 👋 I'm BookNook AI. How can I help you find your next book?"
            }
        ]);

        setConversationId(null);
        setInput("");
    };

    return (
        <div className="container py-4">

            <div
                className="card shadow-sm border-0 mx-auto"
                style={{ maxWidth: "950px", height: "75vh" }}
            >

                {/* ================= HEADER ================= */}

                <div className="card-header bg-white border-bottom py-3">

                    <div className="d-flex justify-content-between align-items-center">

                        <div className="d-flex align-items-center">

                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{
                                    width: "45px",
                                    height: "45px",
                                    backgroundColor: "#f3e8e2"
                                }}
                            >
                                <i
                                    className="bi bi-stars fs-5"
                                    style={{ color: "#a6532b" }}
                                ></i>
                            </div>

                            <div>
                                <h5 className="mb-0 fw-bold">
                                    BookNook AI
                                </h5>

                                <small className="text-muted">
                                    Your personal book assistant
                                </small>
                            </div>

                        </div>

                        <button
                            className="btn btn-outline-dark btn-sm"
                            onClick={newChat}
                            disabled={loading}
                        >
                            <i className="bi bi-plus-lg me-1"></i>
                            New Chat
                        </button>

                    </div>

                </div>


                {/* ================= CHAT BODY ================= */}

                <div
                    className="card-body overflow-auto bg-light"
                >

                    {messages.map((message, index) => (

                        <div
                            key={index}
                            className={`d-flex mb-3 ${
                                message.role === "user"
                                    ? "justify-content-end"
                                    : "justify-content-start"
                            }`}
                        >

                            {/* AI Avatar */}

                            {message.role === "assistant" && (
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center me-2 flex-shrink-0"
                                    style={{
                                        width: "36px",
                                        height: "36px",
                                        backgroundColor: "#f3e8e2",
                                        color: "#a6532b"
                                    }}
                                >
                                    <i className="bi bi-stars"></i>
                                </div>
                            )}


                            {/* Message */}

                            <div
                                className={`p-3 rounded-3 ${
                                    message.role === "user"
                                        ? "bg-success text-white"
                                        : "bg-white border"
                                }`}
                                style={{
                                    maxWidth: "70%"
                                }}
                            >
                                <div>
                                    <ReactMarkdown>
                                        {message.content}
                                    </ReactMarkdown>
                                </div>

                                <small
                                    className={
                                        message.role === "user"
                                            ? "text-white-50"
                                            : "text-muted"
                                    }
                                >
                                    {new Date().toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </small>

                            </div>


                            {/* User Avatar */}

                            {message.role === "user" && (
                                <div
                                    className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center ms-2 flex-shrink-0"
                                    style={{
                                        width: "36px",
                                        height: "36px"
                                    }}
                                >
                                    <i className="bi bi-person"></i>
                                </div>
                            )}

                        </div>

                    ))}


                    {/* ================= LOADING ================= */}

                    {loading && (
                        <div className="d-flex align-items-center mb-3">

                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    backgroundColor: "#f3e8e2",
                                    color: "#a6532b"
                                }}
                            >
                                <i className="bi bi-stars"></i>
                            </div>

                            <div className="bg-white border rounded-3 px-3 py-2">

                                <div className="spinner-border spinner-border-sm text-secondary me-2"></div>

                                <span className="text-muted">
                                    Thinking...
                                </span>

                            </div>

                        </div>
                    )}

                    <div ref={messagesEndRef}></div>

                </div>


                

                <div className="card-footer bg-white border-top p-3">

                    <form onSubmit={sendMessage}>

                        <div className="input-group">

                            <textarea
                                className="form-control"
                                placeholder="Ask BookNook AI anything..."
                                rows="1"
                                value={input}
                                onChange={(e) =>
                                    setInput(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Enter" &&
                                        !e.shiftKey
                                    ) {
                                        e.preventDefault();
                                        sendMessage(e);
                                    }
                                }}
                                disabled={loading}
                            />

                            <button
                                type="submit"
                                className="btn text-white px-4"
                                style={{
                                    backgroundColor: "#a6532b"
                                }}
                                disabled={
                                    loading || !input.trim()
                                }
                            >
                                {loading ? (
                                    <span
                                        className="spinner-border spinner-border-sm"
                                    ></span>
                                ) : (
                                    <i className="bi bi-send-fill"></i>
                                )}
                            </button>

                        </div>

                        <div className="text-center mt-2">
                            <small className="text-muted">
                                BookNook AI can make mistakes. Please verify
                                important information.
                            </small>
                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default ChatAI;