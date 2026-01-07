import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FileImage, FileText, FileType, Download } from 'lucide-react';

type AttachedFile = {
    id: number;
    name: string;
    type: 'pdf' | 'doc' | 'image';
    url: string;
    sizeLabel: string;
    preview?: string | null;
};

type StudyFilesPreviewModalProps = {
    open: boolean;
    file: AttachedFile | null;
    onOpenChange: (open: boolean) => void;
};

const fileIconMap = {
    pdf: <FileText className="h-8 w-8 text-red-500" />,
    doc: <FileType className="h-8 w-8 text-blue-500" />,
    image: <FileImage className="h-8 w-8 text-emerald-500" />,
};

export default function StudyFilesPreviewModal({
    open,
    file,
    onOpenChange,
}: StudyFilesPreviewModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!w-[92vw] !max-w-[900px] max-h-[95vh] h-[95vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Preview do arquivo</DialogTitle>
                    <DialogDescription>
                        {file ? `${file.name} · ${file.sizeLabel}` : 'Selecione um arquivo para visualizar.'}
                    </DialogDescription>
                </DialogHeader>
                {file ? (
                    <div className="space-y-4 flex-1 min-h-0">
                        {file.type === 'image' && file.preview ? (
                            <div className="rounded-lg overflow-hidden border border-emerald-100 bg-emerald-50/40 h-full">
                                <img
                                    src={file.preview}
                                    alt={file.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ) : file.type !== 'image' ? (
                            <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 h-full">
                                <iframe
                                    title={`Preview ${file.name}`}
                                    src={file.url}
                                    className="w-full h-full"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-12">
                                {fileIconMap[file.type]}
                            </div>
                        )}
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                const anchor = document.createElement('a');
                                anchor.href = file.url;
                                anchor.download = file.name;
                                anchor.click();
                            }}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Baixar arquivo
                        </Button>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}

export type { AttachedFile };
