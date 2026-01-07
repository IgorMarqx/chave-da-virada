import { notifications } from '@/components/ui/notification';
import { http, isApiError } from '@/lib/http';
import { useState } from 'react';

type UpsertAnotacaoData = {
    topico_id: number;
    titulo?: string | null;
    conteudo: string;
};

export function useUpsertAnotacao() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async (data: UpsertAnotacaoData) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await http.post('/anotacoes', { ...data });

            if (response.data?.success) {
                notifications.success('Anotacoes salvas com sucesso!');
            }
            return response.data?.data ?? null;
        } catch (err) {
            if (isApiError(err)) {
                if (err.response?.data?.message) {
                    setError(err.response.data.message);
                    notifications.danger(err.response.data.message);
                    return null;
                }
            }
            setError('An unexpected error occurred. Please try again.');
            notifications.danger('An unexpected error occurred. Please try again.');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, handleSave };
}
