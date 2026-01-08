import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDuration } from '@/lib/utils';
import { Eye } from 'lucide-react';

type SessionSummaryCardProps = {
    isLoadingEstudos: boolean;
    totalSeconds: number;
    notesCount: number;
};

export function SessionSummaryCard({
    isLoadingEstudos,
    totalSeconds,
    notesCount,
}: SessionSummaryCardProps) {
    return (
        <Card className="border-2 border-amber-100 bg-white/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="h-5 w-5 text-amber-600" />
                    Resumo da Sessao
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2 lg:grid-cols-3">
                    <div className="p-4 bg-amber-50/50 rounded-lg">
                        <p className="text-xl font-bold text-amber-700 sm:text-2xl">
                            {isLoadingEstudos ? '--:--:--' : formatDuration(totalSeconds)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Tempo Total</p>
                    </div>
                    <div className="p-4 bg-emerald-50/50 rounded-lg">
                        <p className="text-xl font-bold text-emerald-700 sm:text-2xl">{notesCount}</p>
                        <p className="text-xs text-slate-500 mt-1">Anotacoes</p>
                    </div>
                    <div className="p-4 bg-sky-50/50 rounded-lg">
                        <p className="text-xl font-bold text-sky-700 sm:text-2xl">0</p>
                        <p className="text-xs text-slate-500 mt-1">Arquivos</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
