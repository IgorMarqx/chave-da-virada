import { notifications } from '@/components/ui/notification';
import { http, isApiError } from '@/lib/http';
import { useCallback, useState } from 'react';

type Concurso = {
    id: number;
    nome: string;
};

type Disciplina = {
    id: number;
    nome: string;
    concurso?: Concurso | null;
};

type Topico = {
    id: number;
    nome: string;
    descricao?: string | null;
    disciplina?: Disciplina | null;
};

export type Revisao = {
    id: number;
    topico_id: number;
    data_revisao: string;
    status: 'pendente' | 'concluida';
    tipo?: string | null;
    origem?: string | null;
    topico?: Topico | null;
};

export function useGetRevisoesHoje() {
    const [revisoes, setRevisoes] = useState<Revisao[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRevisoesHoje = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await http.get('/revisao/hoje');

            if (response.data?.success) {
                setRevisoes(response.data.data ?? []);
                return;
            }

            setError('Nao foi possivel carregar as revisoes.');
            notifications.danger('Nao foi possivel carregar as revisoes.');
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

    return { revisoes, isLoading, error, fetchRevisoesHoje };
}
