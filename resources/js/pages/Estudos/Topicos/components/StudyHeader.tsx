import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type StudyHeaderProps = {
    title: string;
    description?: string | null;
    status: 'Nao iniciado' | 'Estudando' | 'Pausado';
    onBack?: () => void;
};

const statusStyles: Record<StudyHeaderProps['status'], string> = {
    'Nao iniciado': 'bg-sky-100 text-sky-700',
    Estudando: 'bg-green-100 text-green-700',
    Pausado: 'bg-amber-100 text-amber-700',
};

export default function StudyHeader({ title, description, status, onBack }: StudyHeaderProps) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
                {onBack ? (
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/80"
                        onClick={onBack}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                    </Button>
                ) : null}
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
