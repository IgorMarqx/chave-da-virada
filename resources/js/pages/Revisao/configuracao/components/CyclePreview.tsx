import { BookOpen, RefreshCw } from 'lucide-react';

type CyclePreviewProps = {
    diasEstudo: number;
    diasRevisao: number[];
};

const dayNames = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];

export default function CyclePreview({ diasEstudo, diasRevisao }: CyclePreviewProps) {
    const today = new Date().getDay();
    const reviewDays = new Set(diasRevisao);
    const days = Array.from({ length: 7 }, (_, i) => {
        const dayIndex = (today + i) % 7;
        return {
            name: dayNames[dayIndex],
            short: dayNames[dayIndex].slice(0, 3),
            isStudy: i < diasEstudo,
            isReview: reviewDays.has(dayIndex),
        };
    });

    return (
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
            <h4 className="mb-3 text-sm font-medium text-slate-700">Previa do seu ciclo semanal</h4>
            <div className="flex gap-1.5">
                {days.map((day, index) => (
                    <div
                        key={index}
                        className={`flex flex-1 flex-col items-center rounded-lg p-2 transition-all ${
                            day.isReview
                                ? 'bg-emerald-100 ring-2 ring-emerald-500'
                                : day.isStudy
                                    ? 'bg-blue-100'
                                    : 'bg-slate-100'
                        }`}
                    >
                        <span className="text-[10px] font-medium text-slate-500">{day.short}</span>
                        <div className="mt-1.5">
                            {day.isReview ? (
                                <RefreshCw className="h-4 w-4 text-emerald-600" />
                            ) : day.isStudy ? (
                                <BookOpen className="h-4 w-4 text-blue-600" />
                            ) : (
                                <div className="h-4 w-4" />
                            )}
                        </div>
                        <span
                            className={`mt-1 text-[10px] font-medium ${
                                day.isReview ? 'text-emerald-700' : day.isStudy ? 'text-blue-700' : 'text-slate-400'
                            }`}
                        >
                            {day.isReview ? 'Revisao' : day.isStudy ? 'Estudo' : '—'}
                        </span>
                    </div>
                ))}
            </div>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded bg-blue-100" />
                    <span className="text-slate-600">Dias de estudo</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded bg-emerald-100 ring-1 ring-emerald-500" />
                    <span className="text-slate-600">Dia de revisao</span>
                </div>
            </div>
        </div>
    );
}
