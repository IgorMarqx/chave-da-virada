import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import InputError from '@/components/input-error';
import { useState } from 'react';
import StudyHistoryDetailsModal from './StudyHistoryDetailsModal';

type Estudo = {
    id: number;
    tempo_segundos: number;
    data_estudo: string;
};

type StudyHistoryCardProps = {
    estudos: Estudo[];
    isLoading: boolean;
    error?: string | null;
    notesHtml?: string;
};

export default function StudyHistoryCard({ estudos, isLoading, error, notesHtml }: StudyHistoryCardProps) {
    const [selectedEstudo, setSelectedEstudo] = useState<Estudo | null>(null);
    const formatDuration = (totalSeconds: number) => {
        const safeSeconds = Math.max(0, Math.floor(totalSeconds));
        const hours = Math.floor(safeSeconds / 3600);
        const minutes = Math.floor((safeSeconds % 3600) / 60);
        const seconds = safeSeconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <Card className="border-amber-100 bg-white/80 backdrop-blur-sm max-h-95" id="historico">
            <CardHeader>
                <CardTitle className="text-lg">Historico de Estudos</CardTitle>
                <p className="text-sm text-sky-600">
                    {estudos.length} registro{estudos.length === 1 ? '' : 's'}
                </p>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-95 pr-2">
                <InputError message={error ?? undefined} />
                {isLoading ? (
                    <div className="flex items-center justify-center py-8 text-slate-500">
                        <Spinner />
                    </div>
                ) : estudos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                        <p className="text-sm">Nenhum registro encontrado</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {estudos.map((estudo) => (
                            <div key={estudo.id} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                                <div className="text-sm font-semibold text-slate-900">Estudo</div>
                                <div className="mt-1 text-xs text-slate-500">
                                    {new Date(estudo.data_estudo).toLocaleString('pt-BR')}
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    Duracao: {formatDuration(estudo.tempo_segundos)}
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedEstudo(estudo)}
                                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                                    >
                                        Ver detalhes
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            <StudyHistoryDetailsModal
                estudo={selectedEstudo}
                notesHtml={notesHtml}
                onOpenChange={(open) => !open && setSelectedEstudo(null)}
                formatDuration={formatDuration}
            />
        </Card>
    );
}
