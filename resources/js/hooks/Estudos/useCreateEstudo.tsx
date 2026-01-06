import { notifications } from '@/components/ui/notification';
import { http, isApiError } from '@/lib/http';
import { useState } from 'react';

type CreateEstudoData = {
    topico_id: number;
    tempo_segundos: number;
    data_estudo: string;
    origem?: string;
    observacao?: string;
};

export function useCreateEstudo() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateEstudo = async (data: CreateEstudoData) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await http.post('/estudos', { ...data });

            if (response.data?.success) {
                notifications.success('Estudo registrado com sucesso!');
            }
        } catch (err) {
            if (isApiError(err)) {
                if (err.response?.data?.message) {
                    setError(err.response.data.message);
                    notifications.danger(err.response.data.message);
                    return;
                }
            } else {
                setError('An unexpected error occurred. Please try again.');
                notifications.danger('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, handleCreateEstudo };
}
