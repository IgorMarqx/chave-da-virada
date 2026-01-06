import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

type FinishStudyDialogProps = {
    disabled: boolean;
    isSaving: boolean;
    onConfirm: () => Promise<void>;
};

export default function FinishStudyDialog({
    disabled,
    isSaving,
    onConfirm,
}: FinishStudyDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className="bg-green-500 text-white hover:bg-green-600 hover:text-white cursor-pointer"
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                >
                    Finalizar
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Finalizar estudo?</DialogTitle>
                <DialogDescription>
                    Isso vai salvar o tempo estudado e encerrar a sessao atual.
                </DialogDescription>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary" type="button">
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button
                        className="bg-green-500 text-white hover:bg-green-600 hover:text-white"
                        type="button"
                        onClick={async () => {
                            setIsOpen(false);
                            await onConfirm();
                        }}
                        disabled={isSaving}
                    >
                        Confirmar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
