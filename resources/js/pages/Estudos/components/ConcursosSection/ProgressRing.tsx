export default function ProgressRing({ value, size = 56 }: { value: number; size?: number }) {
    const angle = Math.min(100, Math.max(0, value)) * 3.6;
    return (
        <div
            className="relative grid place-items-center rounded-full bg-red-50 text-red-600"
            style={{
                width: size,
                height: size,
                background: `conic-gradient(#ef4444 ${angle}deg, #fee2e2 0deg)`,
            }}
        >
            <div className="grid size-[70%] place-items-center rounded-full bg-white text-xs font-semibold text-slate-700">
                {value}%
            </div>
        </div>
    );
}
