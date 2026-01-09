import { useState } from 'react';
import { http, isApiError } from '@/lib/http';
import type { User } from './useGetUsers';
import { notifications } from '@/components/ui/notification';

type UpdateUserPayload = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
    password?: string;
    password_confirmation?: string;
    must_reset_password?: boolean;
};

export function useUpdateUser() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateUser = async ({ id, ...payload }: UpdateUserPayload) => {
        setError(null);
        setIsUpdating(true);

        try {
            const response = await http.put(`/users/${id}`, payload);
            notifications.success('Usuário atualizado com sucesso.');
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
            setIsUpdating(false);
        }
    };

    return { updateUser, isUpdating, error };
}
