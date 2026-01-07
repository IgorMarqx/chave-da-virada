import { notifications } from '@/components/ui/notification';
import { http, isApiError } from '@/lib/http';
import { useCallback, useState } from 'react';

type Topico = {
    id: number;
    disciplina_id: number;
    nome: string;
    descricao?: string | null;
    ordem: number;
    proxima_revisao?: string | null;
    ultima_atividade?: string | null;
    mastery_score?: number;
};

export function useGetTopicosByDisciplina() {
    const [topicos, setTopicos] = useState<Topico[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTopicos = useCallback(async (disciplinaId: number) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await http.get(`/topicos/disciplina/${disciplinaId}`);

            if (response.data?.success) {
                setTopicos(response.data.data ?? []);
                return;
            }

            setError('Nao foi possivel carregar os topicos.');
            notifications.danger('Nao foi possivel carregar os topicos.');
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

    return { topicos, isLoading, error, fetchTopicos };
}
