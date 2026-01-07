import { notifications } from '@/components/ui/notification';
import { http, isApiError } from '@/lib/http';
import { useCallback, useState } from 'react';
import type { Topico } from './useGetTopicosByDisciplina';

export function useUpdateTopicosOrder() {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateTopicosOrder = useCallback(
        async (disciplinaId: number, topicoIds: number[]): Promise<Topico[] | null> => {
            setError(null);
            setIsSaving(true);

            try {
                const response = await http.patch('/topicos/ordem', {
                    disciplina_id: disciplinaId,
                    topicos: topicoIds,
                });

                if (response.data?.success) {
                    return response.data.data ?? [];
                }

                setError('Nao foi possivel atualizar a ordem dos topicos.');
                notifications.danger('Nao foi possivel atualizar a ordem dos topicos.');
            } catch (err) {
                if (isApiError(err)) {
                    if (err.response?.data?.message) {
                        setError(err.response.data.message);
                        notifications.danger(err.response.data.message);
                        return null;
                    }
                }

                setError('An unexpected error occurred. Please try again.');
                notifications.danger('An unexpected error occurred. Please try again.');
            } finally {
                setIsSaving(false);
            }

            return null;
        },
        []
    );

    return { updateTopicosOrder, isSaving, error };
}
