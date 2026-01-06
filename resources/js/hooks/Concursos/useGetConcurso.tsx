import { notifications } from '@/components/ui/notification';
import { http, isApiError } from '@/lib/http';
import { Concurso } from '@/types/Concursos';
import { useState } from 'react';

export function useGetConcurso() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [concursos, setConcursos] = useState<Concurso[]>([]);

    const fetchConcursos = async () => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await http.get('/concursos');

            if (response.data?.success) {
                setConcursos(response.data.data ?? []);
                return;
            }

            setError('Nao foi possivel carregar os concursos.');
            notifications.danger('Nao foi possivel carregar os concursos.');
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

    return { concursos, isLoading, error, fetchConcursos };
}
