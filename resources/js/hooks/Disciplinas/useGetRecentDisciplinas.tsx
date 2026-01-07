import { useCallback, useState } from 'react';
import { http, isApiError } from '@/lib/http';

type Disciplina = {
    id: number;
    nome: string;
    concurso_id: number;
    topicos: number;
    progresso: number;
};

export function useGetRecentDisciplinas() {
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecentDisciplinas = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await http.get('/disciplinas/recent');
            setDisciplinas(response.data?.data ?? []);
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

    return { disciplinas, isLoading, error, fetchRecentDisciplinas };
}
