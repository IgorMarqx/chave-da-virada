import { useState } from 'react';
import { http, isApiError } from '@/lib/http';
import type { User } from './useGetUsers';
import { notifications } from '@/components/ui/notification';

export function useToggleUserStatus() {
    const [isToggling, setIsToggling] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleStatus = async (userId: string) => {
        setError(null);
        setIsToggling(true);

        try {
            const response = await http.patch(`/users/${userId}/status`);
            notifications.success('Status do usuário atualizado com sucesso.');
            return response.data?.data as User;
        } catch (err) {
            if (isApiError(err)) {
                if (err.response?.data?.message) {
                    setError(err.response.data.message);
                    notifications.danger(err.response.data.message);
                    return null;
                }
            }
            setError('An unexpected error occurred. Please try again.');
            return null;
        } finally {
            setIsToggling(false);
        }
    };

    return { toggleStatus, isToggling, error };
}
