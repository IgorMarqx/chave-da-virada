import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type StudyFilesProcessedModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function StudyFilesProcessedModal({
    open,
    onOpenChange,
}: StudyFilesProcessedModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!w-[92vw] !max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>Arquivo processado</DialogTitle>
                    <DialogDescription>
                        O upload terminou e o arquivo ja esta disponivel na
                        lista.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>
                        Entendi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
