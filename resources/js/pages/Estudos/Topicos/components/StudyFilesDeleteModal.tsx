import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type StudyFilesDeleteModalProps = {
    open: boolean;
    fileName?: string | null;
    isDeleting?: boolean;
    onConfirm: () => void;
    onOpenChange: (open: boolean) => void;
};

export default function StudyFilesDeleteModal({
    open,
    fileName,
    isDeleting,
    onConfirm,
    onOpenChange,
}: StudyFilesDeleteModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!w-[92vw] !max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>Remover arquivo</DialogTitle>
                    <DialogDescription>
                        {fileName
                            ? `Tem certeza que deseja remover "${fileName}"?`
                            : 'Tem certeza que deseja remover este arquivo?'}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? 'Removendo...' : 'Remover'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
