import { cn } from '@/lib/utils';

type StudyHeaderProps = {
    title: string;
    description?: string | null;
    status: 'Nao iniciado' | 'Estudando' | 'Pausado';
};

const statusStyles: Record<StudyHeaderProps['status'], string> = {
    'Nao iniciado': 'bg-sky-100 text-sky-700',
    Estudando: 'bg-green-100 text-green-700',
    Pausado: 'bg-amber-100 text-amber-700',
};

export default function StudyHeader({ title, description, status }: StudyHeaderProps) {
    return (
        <div className="flex flex-wrap items-start justify-between">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
                <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>
            <span
                className={cn(
                    'rounded-full px-3 py-1 text-sm font-medium',
                    statusStyles[status]
                )}
            >
                {status}
            </span>
        </div>
    );
}
