import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, Clock, Eye, NotebookPen } from 'lucide-react';

type Estudo = {
    id: number;
    tempo_segundos: number;
    data_estudo: string;
};

type StudyHistoryDetailsModalProps = {
    estudo: Estudo | null;
    notesHtml?: string;
    onOpenChange: (open: boolean) => void;
    formatDuration: (totalSeconds: number) => string;
};

export default function StudyHistoryDetailsModal({
    estudo,
    notesHtml,
    onOpenChange,
    formatDuration,
}: StudyHistoryDetailsModalProps) {
    return (
        <Dialog open={!!estudo} onOpenChange={onOpenChange}>
            <DialogContent className="!w-[55vw] !max-w-[1500px] max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader className="pb-4 border-b">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Eye className="h-5 w-5 text-sky-600" />
                        Detalhes do Estudo
                    </DialogTitle>
                    <DialogDescription>
                        Informacoes completas da sessao de estudo
                    </DialogDescription>
                </DialogHeader>
                {estudo && (
                    <div className="flex-1 overflow-y-auto py-4 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-4 w-4 text-sky-600" />
                                    <span className="text-xs font-semibold text-sky-600 uppercase tracking-wide">Data</span>
                                </div>
                                <p className="text-slate-900 font-bold">
                                    {new Date(estudo.data_estudo).toLocaleString('pt-BR')}
                                </p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="h-4 w-4 text-amber-600" />
                                    <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Duracao</span>
                                </div>
                                <p className="text-slate-900 font-bold font-mono">
                                    {formatDuration(estudo.tempo_segundos)}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <NotebookPen className="h-4 w-4 text-emerald-600" />
                                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Anotacoes</span>
                            </div>

                            {notesHtml ? (
                                <div className="max-h-[300px] overflow-y-auto pr-2">
                                    <div
                                        className="ProseMirror max-w-none rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 text-sm text-slate-700"
                                        dangerouslySetInnerHTML={{ __html: notesHtml }}
                                    />
                                </div>
                            ) : (
                                <div className="p-8 bg-slate-50 rounded-xl border border-dashed text-center text-slate-500">
                                    <NotebookPen className="h-10 w-10 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">Nenhuma anotacao foi feita nesta sessao</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
