import { useCallback, useState } from 'react';
import { http, isApiError } from '@/lib/http';

type Arquivo = {
    id: number;
    user_id: number;
    topico_id: number | null;
    nome_original: string;
    tipo: 'pdf' | 'doc' | 'image';
    path: string;
    tamanho_bytes: number | null;
    created_at: string;
};

export function useArquivosByTopico() {
    const [arquivos, setArquivos] = useState<Arquivo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchArquivos = useCallback(async (topicoId: number) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await http.get(`/arquivos/topico/${topicoId}`);
            setArquivos(response.data?.data ?? []);
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

    const addArquivo = (arquivo: Arquivo) => {
        setArquivos((current) => [arquivo, ...current]);
    };

    const removeArquivo = (arquivoId: number) => {
        setArquivos((current) => current.filter((arquivo) => arquivo.id !== arquivoId));
    };

    return { arquivos, isLoading, error, fetchArquivos, addArquivo, removeArquivo };
}

export type { Arquivo };
