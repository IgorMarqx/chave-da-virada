import { notifications } from '@/components/ui/notification';
import { http, isApiError } from '@/lib/http';
import { useCallback, useState } from 'react';

export type RevisaoConfiguracao = {
    id: number;
    user_id: number;
    ativo: boolean;
    modo: 'semanal' | 'intervalos' | 'misto';
    dias_estudo: number;
    dia_revisao: number;
    dias_revisao?: number[] | null;
    usar_ultima_revisao: boolean;
    janela_estudo_dias?: number | null;
    timezone?: string | null;
};

export function useGetRevisaoConfiguracao() {
    const [config, setConfig] = useState<RevisaoConfiguracao | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchConfiguracao = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await http.get('/revisao/configuracao');

            if (response.data?.success) {
                setConfig(response.data.data ?? null);
                return;
            }

            setError('Nao foi possivel carregar a configuracao.');
            notifications.danger('Nao foi possivel carregar a configuracao.');
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

    return { config, isLoading, error, fetchConfiguracao };
}
