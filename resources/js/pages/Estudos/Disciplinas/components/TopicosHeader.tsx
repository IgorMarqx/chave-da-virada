import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';

type TopicosHeaderProps = {
    disciplinaNome: string;
    totalTopicos: number;
    backHref: string;
    onCreate: () => void;
};

export default function TopicosHeader({
    disciplinaNome,
    totalTopicos,
    backHref,
    onCreate,
}: TopicosHeaderProps) {
    const totalLabel = totalTopicos === 1 ? 'topico cadastrado' : 'topicos cadastrados';

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Topicos de {disciplinaNome}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    {totalTopicos} {totalLabel}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Button onClick={onCreate} className="gap-2 bg-red-500 hover:bg-red-600 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Criar topico
                </Button>
                <Button asChild variant="outline" className="gap-2 bg-transparent">
                    <Link href={backHref}>
                        <ArrowLeft className="h-4 w-4" />
                        Voltar
                    </Link>
                </Button>
            </div>
        </div>
    );
}
