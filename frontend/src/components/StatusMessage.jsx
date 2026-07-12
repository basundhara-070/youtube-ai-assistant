export default function StatusMessage({ message, type }) {
    if (!message) return null;

    const styles = {
        success: {
            wrap: "border-[#34a853]/20 bg-[#f0fdf4] text-[#188038]",
            icon: (
                <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            ),
        },
        error: {
            wrap: "border-[#ea4335]/20 bg-[#fef2f2] text-[#d93025]",
            icon: (
                <>
                    <circle cx="12" cy="12" r="9" strokeWidth="2" />
                    <path d="M12 8v5M12 16h.01" strokeWidth="2" strokeLinecap="round" />
                </>
            ),
        },
    };

    const style = styles[type];

    return (
        <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-sm ${style.wrap}`}>
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="mt-0.5 shrink-0"
            >
                {style.icon}
            </svg>
            <p className="leading-snug">{message}</p>
        </div>
    );
}