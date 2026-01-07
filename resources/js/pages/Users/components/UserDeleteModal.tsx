import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useDeleteUser } from '@/hooks/Users/useDeleteUser';

type UserDeleteModalProps = {
    open: boolean;
    userId: string | null;
    userName: string | null;
    onClose: () => void;
    onDeleted: () => void;
};

export default function UserDeleteModal({
    open,
    userId,
    userName,
    onClose,
    onDeleted,
}: UserDeleteModalProps) {
    const { deleteUser, isDeleting } = useDeleteUser();

    if (!open) {
        return null;
    }

    const handleConfirm = async () => {
        if (!userId) {
            return;
        }
        const success = await deleteUser(userId);
        if (success) {
            onDeleted();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                        <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 text-center mb-2">
                        Excluir Usuario
                    </h3>
                    <p className="text-slate-500 text-center mb-6">
                        Tem certeza que deseja excluir{' '}
                        <span className="font-medium text-slate-700">{userName}</span>? Esta acao nao pode ser desfeita.
                    </p>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose} className="flex-1 border-slate-200">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Excluindo...' : 'Excluir'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
