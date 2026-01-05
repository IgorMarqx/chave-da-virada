import { notifications } from '@/components/ui/notification';
import { http, isApiError, setAuthExpiresIn, setAuthToken, setAuthUser } from '@/lib/http';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export function useLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleLogin = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await http.post('/auth/login', { email, password });

            const token = response.data?.access_token as string | undefined;
            if (token) {
                setAuthToken(token);
            }

            setAuthUser(response.data?.user ?? null);

            const expiresIn = response.data?.expires_in as number | undefined;
            if (typeof expiresIn === 'number') {
                setAuthExpiresIn(expiresIn);
            }

            router.post(
                '/login',
                { email, password },
                {
                    onSuccess: () => {
                        router.visit('/dashboard');
                    },
                    onError: () => {
                        notifications.danger(
                            'Falha ao iniciar a sessao. Tente novamente.',
                        );
                    },
                },
            );
        } catch (err) {
            if (isApiError(err)) {
                if (err.response?.data?.message) {
                    setError(err.response.data.message);
                    notifications.danger(err.response.data.message);
                    return;
                }
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, handleLogin };
}
