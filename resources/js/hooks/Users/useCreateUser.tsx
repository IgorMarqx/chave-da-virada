import { useState } from 'react';
import { http, isApiError } from '@/lib/http';
import type { User } from './useGetUsers';

type CreateUserPayload = {
    name: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
    password: string;
    password_confirmation: string;
    must_reset_password: boolean;
};

export function useCreateUser() {
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createUser = async (payload: CreateUserPayload) => {
        setError(null);
        setIsCreating(true);

        try {
            const response = await http.post('/users', payload);
            return response.data?.data as User;
        } catch (err) {
            if (isApiError(err)) {
                if (err.response?.data?.message) {
                    setError(err.response.data.message);
                    return null;
                }
            }
            setError('An unexpected error occurred. Please try again.');
            return null;
        } finally {
            setIsCreating(false);
        }
    };

    return { createUser, isCreating, error };
}
