import { notifications } from '@/components/ui/notification';
import { http, isApiError } from '@/lib/http';
import { useState } from 'react';

export function useIniciarRevisao() {
    const [isSaving, setIsSaving] = useState(false);

    const iniciarRevisao = async (revisaoId: number): Promise<boolean> => {
        setIsSaving(true);

        try {
            const response = await http.post(`/revisoes/${revisaoId}/iniciar`);
            if (response.data?.success) {
                return true;
            }

            notifications.danger('Nao foi possivel iniciar a revisao.');
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

    return { iniciarRevisao, isSaving };
}
