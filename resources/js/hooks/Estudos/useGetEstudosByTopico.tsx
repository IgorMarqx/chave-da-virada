import { notifications } from '@/components/ui/notification';
import { http, isApiError } from '@/lib/http';
import { useCallback, useState } from 'react';

type Estudo = {
    id: number;
    topico_id: number;
    tempo_segundos: number;
    data_estudo: string;
    origem?: string | null;
    observacao?: string | null;
};

export function useGetEstudosByTopico() {
    const [estudos, setEstudos] = useState<Estudo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEstudos = useCallback(async (topicoId: number) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await http.get(`/estudos/topico/${topicoId}`);

            if (response.data?.success) {
                setEstudos(response.data.data ?? []);
                return;
            }

            setError('Nao foi possivel carregar o historico.');
            notifications.danger('Nao foi possivel carregar o historico.');
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

    return { estudos, isLoading, error, fetchEstudos };
}
