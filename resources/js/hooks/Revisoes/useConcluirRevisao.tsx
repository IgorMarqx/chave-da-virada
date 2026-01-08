import { notifications } from '@/components/ui/notification';
import { http, isApiError } from '@/lib/http';
import { useState } from 'react';

export function useConcluirRevisao() {
    const [isSaving, setIsSaving] = useState(false);

    const concluirRevisao = async (revisaoId: number): Promise<boolean> => {
        setIsSaving(true);

        try {
            const response = await http.post(`/revisoes/${revisaoId}/concluir`);
            if (response.data?.success) {
                return true;
            }

            notifications.danger('Nao foi possivel concluir a revisao.');
            return false;
        } catch (err) {
            if (isApiError(err)) {
                if (err.response?.data?.message) {
                    notifications.danger(err.response.data.message);
                    return false;
                }
            }

            notifications.danger('An unexpected error occurred. Please try again.');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return { concluirRevisao, isSaving };
}
