import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Plus } from 'lucide-react';

type TopicosEmptyStateCardProps = {
    onCreate: () => void;
};

export default function TopicosEmptyStateCard({ onCreate }: TopicosEmptyStateCardProps) {
    return (
        <Card className="border-dashed py-0">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                    <BookOpen className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">Nenhum topico encontrado</h3>
                <p className="mb-6 max-w-sm text-sm text-slate-500">
                    Comece criando seu primeiro topico para organizar seus estudos.
                </p>
                <Button onClick={onCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Criar topico
                </Button>
            </CardContent>
        </Card>
    );
}
