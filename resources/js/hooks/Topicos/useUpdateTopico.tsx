import { notifications } from '@/components/ui/notification';
import { http, isApiError } from '@/lib/http';
import { UpdateTopicoData } from '@/types/Topicos';
import { useState } from 'react';

export function useUpdateTopico() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdateTopico = async (topicoId: number, data: UpdateTopicoData) => {
        setError(null);
        if (!validateData(data)) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await http.patch(`/topicos/${topicoId}`, { ...data });

            if (response.data?.success) {
                notifications.success('Topico atualizado com sucesso!');
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

    const validateData = (data: UpdateTopicoData) => {
        if (data.nome.trim() === '') {
            notifications.danger('O nome do topico e obrigatorio.');
            setError('O nome do topico e obrigatorio.');
            return false;
        }

        return true;
    };

    return { isLoading, error, handleUpdateTopico };
}
