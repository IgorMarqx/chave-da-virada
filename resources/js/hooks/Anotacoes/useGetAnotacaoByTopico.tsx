import { useState } from 'react';
import { http, isApiError } from '@/lib/http';

type Anotacao = {
    id: number;
    topico_id: number;
    user_id: number;
    titulo: string | null;
    conteudo: string;
};

export function useGetAnotacaoByTopico() {
    const [anotacao, setAnotacao] = useState<Anotacao | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAnotacao = async (topicoId: number) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await http.get(`/anotacoes/topico/${topicoId}`);
            setAnotacao(response.data?.data ?? null);
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
    };

    return { anotacao, isLoading, error, fetchAnotacao };
}
