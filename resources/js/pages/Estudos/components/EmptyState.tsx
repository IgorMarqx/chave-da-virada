export default function EmptyState({ title, action }: { title: string; action: string }) {
    return (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-white/70 px-6 py-10 text-center shadow-sm">
            <div className="flex size-12 items-center justify-center rounded-full bg-red-100 text-red-700">
                <svg
                    viewBox="0 0 24 24"
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
            </div>
            <div className="text-lg font-semibold text-slate-900">{title}</div>
            <button className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
                {action}
            </button>
        </div>
    );
}
