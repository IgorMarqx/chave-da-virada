import { useCallback, useState } from 'react';
import { http, isApiError } from '@/lib/http';

export type UserRole = 'admin' | 'user';
export type UserStatus = 'ativo' | 'inativo';

export type User = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    lastAccess: string;
    mustResetPassword?: boolean;
};

export function useGetUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await http.get('/users');
            setUsers(response.data?.data ?? []);
        } catch (err) {
            if (isApiError(err)) {
                if (err.response?.data?.message) {
                    setError(err.response.data.message);
                    return;
                }
            }
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { users, setUsers, isLoading, error, fetchUsers };
}
