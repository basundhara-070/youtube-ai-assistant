"use client";

import { useState, useRef, useEffect } from "react";

import api from "../services/api";

import ChatInput from "./ChatInput";
import Message from "./Message";
import Loader from "./Loader";

export default function ChatBox() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, loading]);

    async function sendMessage(question) {
        const userMessage = { role: "user", content: question };
        setMessages((prev) => [...prev, userMessage]);

        try {
            setLoading(true);
            const res = await api.post("/chat", { question });

            const botMessage = { role: "assistant", content: res.data.answer };
            setMessages((prev) => [...prev, botMessage]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Something went wrong." },
            ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="relative overflow-hidden rounded-[22px] border border-slate-200 bg-[linear-gradient(135deg,_#ffffff_0%,_#fcfdff_100%)] shadow-inner shadow-slate-100">
                <div className="absolute inset-x-0 top-0 h-[2px] overflow-hidden bg-transparent">
                    {loading && (
                        <div className="h-full w-1/3 bg-gradient-to-r from-[#ff4d4f] via-[#ff0000] to-[#ff7a7a] animate-[buffer_1.1s_ease-in-out_infinite]" />
                    )}
                </div>

                <div ref={scrollRef} className="h-[420px] space-y-5 overflow-y-auto p-5">
                    {messages.length === 0 && (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                            <p className="text-sm text-slate-500">Ask your first question about the video.</p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <Message key={index} role={msg.role} content={msg.content} />
                    ))}

                    {loading && <Loader label="Generating answer..." />}
                </div>
            </div>

            <ChatInput onSend={sendMessage} loading={loading} />

            <style jsx global>{`
                @keyframes buffer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(300%);
                    }
                }
            `}</style>
        </>
    );
}