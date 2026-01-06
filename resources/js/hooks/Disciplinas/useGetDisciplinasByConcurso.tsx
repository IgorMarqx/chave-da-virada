import { notifications } from '@/components/ui/notification';
import { http, isApiError } from '@/lib/http';
import { useCallback, useState } from 'react';

type Disciplina = {
    id: number;
    nome: string;
    concurso_id: number;
    topicos?: number;
    progresso?: number;
};

export function useGetDisciplinasByConcurso() {
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDisciplinas = useCallback(async (concursoId: number) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await http.get(`/disciplinas/concurso/${concursoId}`);

            if (response.data?.success) {
                setDisciplinas(response.data.data ?? []);
                return;
            }

            setError('Nao foi possivel carregar as disciplinas.');
            notifications.danger('Nao foi possivel carregar as disciplinas.');
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

    return { disciplinas, isLoading, error, fetchDisciplinas };
}
