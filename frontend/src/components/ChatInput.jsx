"use client";

import { useState } from "react";

export default function ChatInput({ onSend, loading }) {
    const [question, setQuestion] = useState("");

    const send = () => {
        if (!question.trim()) return;
        onSend(question);
        setQuestion("");
    };

    return (
        <div className="mt-4 flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1.5 pl-4 shadow-sm transition focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-200">
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask something about the video..."
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
            />

            <button
                onClick={send}
                disabled={loading}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff0000] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
            >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
            </button>
        </div>
    );
}