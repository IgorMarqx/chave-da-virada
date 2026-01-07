import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { NotebookPen } from 'lucide-react';

type NotesModalProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    notesHtml: string;
};

export function NotesModal({ isOpen, onOpenChange, notesHtml }: NotesModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="!w-[95vw] !max-w-[1600px] max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="pb-4 border-b">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <NotebookPen className="h-5 w-5 text-emerald-600" />
                        Anotacoes do Topico
                    </DialogTitle>
                    <DialogDescription>Visualizacao ampliada das suas anotacoes.</DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto py-4">
                    <div className="ProseMirror max-w-none rounded-lg border border-emerald-100 bg-emerald-50/50 p-4 text-sm text-slate-700">
                        <div dangerouslySetInnerHTML={{ __html: notesHtml }} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
