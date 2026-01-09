import { notifications } from '@/components/ui/notification';
import { http, isApiError } from '@/lib/http';
import { useState } from 'react';
import type { RevisaoConfiguracao } from './useGetRevisaoConfiguracao';

type RevisaoConfiguracaoPayload = Partial<
    Omit<RevisaoConfiguracao, 'id' | 'user_id'>
>;

export function useUpdateRevisaoConfiguracao() {
    const [isSaving, setIsSaving] = useState(false);

    const updateConfiguracao = async (payload: RevisaoConfiguracaoPayload): Promise<boolean> => {
        setIsSaving(true);

        try {
            const response = await http.put('/revisao/configuracao', payload);

            if (response.data?.success) {
                notifications.success('Configuração salva com sucesso.');
                return true;
            }

            notifications.danger('Nao foi possivel salvar a configuracao.');
            return false;
        } catch (err) {
            if (isApiError(err)) {
                if (err.response?.data?.message) {
                    notifications.danger(err.response.data.message);
                    return false;
                }
            } else {
                notifications.danger('An unexpected error occurred. Please try again.');
            }

            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return { updateConfiguracao, isSaving };
}
