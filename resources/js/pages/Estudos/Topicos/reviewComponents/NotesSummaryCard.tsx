import { Button } from '@/components/ui/button';
import { buildNotesDocument } from '@/pages/Estudos/Topicos/reviewComponents/notesExport';
import { Expand, FileText } from 'lucide-react';

type NotesSummaryCardProps = {
    notesHtml: string;
    setIsNotesOpen: (open: boolean) => void;
};

export default function NotesSummaryCard({ notesHtml, setIsNotesOpen }: NotesSummaryCardProps) {
    const downloadFile = (content: string, filename: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        anchor.click();
        URL.revokeObjectURL(url);
    };

    const handleExportWord = () => {
        const documentHtml = buildNotesDocument(notesHtml);
        downloadFile(documentHtml, 'anotacoes-topico.doc', 'application/msword');
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2 justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportWord}
                    className="bg-white/80 cursor-pointer"
                >
                    <FileText className="mr-2 h-4 w-4" />
                    Word
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsNotesOpen(true)}
                    className="bg-white/80 cursor-pointer"
                >
                    <Expand className="mr-2 h-4 w-4" />
                    Expandir
                </Button>
            </div>
            <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100 max-h-80 overflow-y-auto">
                <div
                    className="ProseMirror max-w-none text-sm text-slate-700"
                    dangerouslySetInnerHTML={{ __html: notesHtml }}
                />
            </div>
        </div>
    )
}
