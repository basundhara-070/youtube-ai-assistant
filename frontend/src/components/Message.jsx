export default function Message({ role, content }) {
    const isUser = role === "user";

    return (
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
            <span className="mb-1 px-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
                {isUser ? "You" : "Assistant"}
            </span>

            <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-7 whitespace-pre-wrap shadow-sm ${
                    isUser
                        ? "bg-gradient-to-r from-[#ff4d4f] to-[#ff0000] text-white"
                        : "border border-slate-200 bg-white text-slate-700"
                }`}
            >
                {content}
            </div>
        </div>
    );
}