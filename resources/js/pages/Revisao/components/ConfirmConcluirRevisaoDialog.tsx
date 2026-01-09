import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type ConfirmConcluirRevisaoDialogProps = {
    open: boolean;
    isSaving: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void>;
};

export default function ConfirmConcluirRevisaoDialog({
    open,
    isSaving,
    onOpenChange,
    onConfirm,
}: ConfirmConcluirRevisaoDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Concluir revisao?</DialogTitle>
                    <DialogDescription>
                        Ao concluir, esta revisao sera marcada como finalizada.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button
                        className="cursor-pointer"
                        type="button"
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Concluindo...' : 'Concluir revisao'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
