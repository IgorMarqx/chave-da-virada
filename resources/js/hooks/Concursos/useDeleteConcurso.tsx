import { notifications } from '@/components/ui/notification';
import { http, isApiError } from '@/lib/http';
import { useState } from 'react';

export function useDeleteConcurso() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteConcurso = async (concursoId: number) => {
        setError(null);
        setIsDeleting(true);

        try {
            const response = await http.delete(`/concursos/${concursoId}`);

            if (response.data?.success) {
                notifications.success('Concurso excluido com sucesso!');
                return true;
            }

            notifications.danger('Nao foi possivel excluir o concurso.');
            return false;
        } catch (err) {
            if (isApiError(err)) {
                if (err.response?.data?.message) {
                    setError(err.response.data.message);
                    notifications.danger(err.response.data.message);
                    return false;
                }
            }
            setError('An unexpected error occurred. Please try again.');
            notifications.danger('An unexpected error occurred. Please try again.');
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    return { deleteConcurso, isDeleting, error };
}
