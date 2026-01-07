import ConfirmDeleteDialog from '@/pages/Estudos/components/common/ConfirmDeleteDialog';
import { useDeleteTopico } from '@/hooks/Topicos/useDeleteTopico';

type DeleteTopicoDialogProps = {
    topico: { id: number; nome: string } | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
};

export default function DeleteTopicoDialog({
    topico,
    open,
    onOpenChange,
    onSuccess,
}: DeleteTopicoDialogProps) {
    const { deleteTopico, isDeleting } = useDeleteTopico();

    const handleConfirm = async () => {
        if (!topico) {
            return;
        }

        const deleted = await deleteTopico(topico.id);
        if (deleted) {
            onOpenChange(false);
            onSuccess();
        }
    };

    return (
        <ConfirmDeleteDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Excluir topico"
            description={`Tem certeza que deseja excluir o topico "${topico?.nome ?? ''}"?`}
            confirmLabel="Excluir topico"
            isDeleting={isDeleting}
            onConfirm={handleConfirm}
        />
    );
}
