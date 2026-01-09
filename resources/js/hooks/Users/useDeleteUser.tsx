import { useState } from 'react';
import { http, isApiError } from '@/lib/http';
import { notifications } from '@/components/ui/notification';

export function useDeleteUser() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteUser = async (userId: string) => {
        setError(null);
        setIsDeleting(true);

        try {
            await http.delete(`/users/${userId}`);
            notifications.success('Usuário apagado com sucesso.');
            return true;
        } catch (err) {
            if (isApiError(err)) {
                if (err.response?.data?.message) {
                    setError(err.response.data.message);
                    notifications.danger(err.response.data.message);
                    return false;
                }
            }
            setError('An unexpected error occurred. Please try again.');
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    return { deleteUser, isDeleting, error };
}
