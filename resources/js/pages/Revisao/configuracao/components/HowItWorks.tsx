import { ArrowRight, BookOpen, Brain, RefreshCw } from 'lucide-react';

const steps = [
    {
        icon: BookOpen,
        title: 'Estude',
        description: 'Nos dias configurados, estude novos topicos normalmente',
        color: 'blue',
    },
    {
        icon: RefreshCw,
        title: 'Revise',
        description: 'No dia de revisao, todos os topicos estudados aparecem para revisar',
        color: 'emerald',
    },
    {
        icon: Brain,
        title: 'Memorize',
        description: 'A revisao espacada ajuda a fixar o conteudo na memoria',
        color: 'amber',
    },
];

const colorClasses = {
    blue: {
        bg: 'bg-blue-100',
        icon: 'text-blue-600',
        title: 'text-blue-900',
    },
    emerald: {
        bg: 'bg-emerald-100',
        icon: 'text-emerald-600',
        title: 'text-emerald-900',
    },
    amber: {
        bg: 'bg-amber-100',
        icon: 'text-amber-600',
        title: 'text-amber-900',
    },
};

export default function HowItWorks() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Como funciona o fluxo de revisao?</h3>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const colors = colorClasses[step.color as keyof typeof colorClasses];
                    return (
                        <div
                            key={index}
                            className="flex flex-1 items-start gap-3 sm:flex-col sm:items-center sm:text-center"
                        >
                            <div className="flex items-center gap-3 sm:flex-col">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors.bg}`}>
                                    <Icon className={`h-5 w-5 ${colors.icon}`} />
                                </div>
                                {index < steps.length - 1 && (
                                    <ArrowRight className="hidden h-4 w-4 text-slate-300 sm:block sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2" />
                                )}
                            </div>
                            <div className="sm:mt-2">
                                <h4 className={`text-sm font-medium ${colors.title}`}>{step.title}</h4>
                                <p className="mt-0.5 text-xs text-slate-500">{step.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
