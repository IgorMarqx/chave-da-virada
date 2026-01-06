export default function ProgressBar({ value }: { value: number }) {
    return (
        <div className="h-2 w-full rounded-full bg-slate-200/80">
            <div
                className="h-full rounded-full bg-red-500"
                style={{ width: `${value}%` }}
            />
        </div>
    );
}
