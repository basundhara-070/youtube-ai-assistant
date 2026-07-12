export default function Loader({ label = "Processing..." }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-[#FF4B3E] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
            <p className="text-sm text-[#8B909B] font-mono">{label}</p>
        </div>
    );
}