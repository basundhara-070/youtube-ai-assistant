export default function Navbar() {
    return (
        <nav className="border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff4d4f] to-[#ff0000] shadow-md">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 1.5v11l10-5.5-10-5.5z" fill="#ffffff" />
                        </svg>
                    </div>

                    <div>
                        <h1 className="text-lg font-semibold tracking-tight text-slate-900 leading-none">
                            YouTube AI Assistant
                        </h1>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-500 font-mono">
                            Ask anything about a video
                        </p>
                    </div>
                </div>

                <div className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-600">
                    Smart chat
                </div>
            </div>
        </nav>
    );
}