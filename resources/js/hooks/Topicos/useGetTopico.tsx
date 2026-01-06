import { notifications } from '@/components/ui/notification';
import { http, isApiError } from '@/lib/http';
import { useCallback, useState } from 'react';

type Topico = {
    id: number;
    disciplina_id: number;
    nome: string;
    descricao?: string | null;
    ordem: number;
    status: 'nao-iniciado' | 'em-andamento' | 'concluido';
    proxima_revisao?: string | null;
    mastery_score?: number;
};

export function useGetTopico() {
    const [topico, setTopico] = useState<Topico | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTopico = useCallback(async (topicoId: number) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await http.get(`/topicos/${topicoId}`);

            if (response.data?.success) {
                setTopico(response.data.data ?? null);
                return;
            }

            setError('Nao foi possivel carregar o topico.');
            notifications.danger('Nao foi possivel carregar o topico.');
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
    }, []);

    return { topico, isLoading, error, fetchTopico };
}
