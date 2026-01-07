import { notifications } from '@/components/ui/notification';
import { http, isApiError } from '@/lib/http';
import { UpdateConcursoData } from '@/types/Concursos';
import { useState } from 'react';

export function useUpdateConcurso() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdateConcurso = async (concursoId: number, data: UpdateConcursoData) => {
        setError(null);
        if (!validateData(data)) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await http.patch(`/concursos/${concursoId}`, { ...data });

            if (response.data?.success) {
                notifications.success('Concurso atualizado com sucesso!');
            }
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

    const validateData = (data: UpdateConcursoData) => {
        if (data.nome.trim() === '') {
            notifications.danger('O nome do concurso e obrigatorio.');
            setError('O nome do concurso e obrigatorio.');
            return false;
        }

        if (data.orgao.trim() === '') {
            notifications.danger('O orgao do concurso e obrigatorio.');
            setError('O orgao do concurso e obrigatorio.');
            return false;
        }

        return true;
    };

    return { isLoading, error, handleUpdateConcurso };
}
