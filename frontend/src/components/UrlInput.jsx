"use client";

import { useState } from "react";
import api from "@/services/api";
import Loader from "./Loader";

export default function UrlInput({ onSuccess, setStatus, setStatusType }) {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const processVideo = async () => {
        if (!url.trim()) {
            setStatus("Please enter a YouTube URL.");
            setStatusType("error");
            return;
        }

        try {
            setLoading(true);
            setStatus("");

            await api.post("/process-video", { url });

            setStatus("Video processed successfully.");
            setStatusType("success");
            onSuccess();
        } catch (err) {
            console.log(err);
            setStatus("Unable to process this video.");
            setStatusType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-[22px] border border-slate-200 bg-gradient-to-br from-[#ffffff] to-[#fbfdff] p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f1] text-[#cc0000]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07L11.5 4.5" />
                        <path d="M14 11a5 5 0 00-7.07 0L4.1 13.83a5 5 0 007.07 7.07l1.36-1.36" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-900">Source video</p>
                    <p className="text-xs text-slate-500">Paste a public YouTube link to begin.</p>
                </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row">
                <div className="relative flex-1">
                    <svg
                        className="absolute left-3.5 top-1/2 -translate-y-1/2"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#8b95a8"
                        strokeWidth="2"
                    >
                        <path d="M10 13a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07L11.5 4.5" />
                        <path d="M14 11a5 5 0 00-7.07 0L4.1 13.83a5 5 0 007.07 7.07l1.36-1.36" />
                    </svg>
                    <input
                        type="text"
                        placeholder="https://youtube.com/watch?v=..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && processVideo()}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 shadow-inner shadow-slate-100 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                </div>

                <button
                    onClick={processVideo}
                    disabled={loading}
                    className="flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#ff4d4f] to-[#ff0000] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#ff0000]/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    Analyze
                </button>
            </div>

            {loading && <Loader label="Reading video..." />}
        </div>
    );
}