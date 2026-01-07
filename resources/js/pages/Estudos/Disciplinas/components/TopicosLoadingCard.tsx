import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

export default function TopicosLoadingCard() {
    return (
        <Card className="py-0">
            <CardContent className="flex items-center justify-center gap-2 py-6 text-sm text-slate-500">
                <Spinner />
                Carregando topicos...
            </CardContent>
        </Card>
    );
}
