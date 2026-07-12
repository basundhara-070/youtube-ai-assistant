"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
import UrlInput from "@/components/UrlInput";
import StatusMessage from "@/components/StatusMessage";
import ChatBox from "@/components/ChatBox";

export default function Home() {
    const [status, setStatus] = useState("");
    const [statusType, setStatusType] = useState("");
    const [videoReady, setVideoReady] = useState(false);

    return (
        <>
            <Navbar />

            <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
                <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-[#ffffff]/95 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur">
                    <div className="flex flex-col gap-6 p-6 sm:p-8 lg:p-10">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-2xl space-y-3">
                                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                                        <path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" />
                                    </svg>
                                    AI video Q&A
                                </div>
                                <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                                    Chat with YouTube videos in seconds
                                </h2>
                            </div>

                        </div>

                        <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                            <UrlInput
                                onSuccess={() => setVideoReady(true)}
                                setStatus={setStatus}
                                setStatusType={setStatusType}
                            />
                            <div className="mt-4">
                                <StatusMessage message={status} type={statusType} />
                            </div>
                        </div>

                        {videoReady && (
                            <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(135deg,_#ffffff_0%,_#fcfdff_100%)] p-3 shadow-sm sm:p-4">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Conversation</p>
                                    </div>
                                    <div className="rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-600">
                                        Live
                                    </div>
                                </div>
                                <ChatBox />
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}