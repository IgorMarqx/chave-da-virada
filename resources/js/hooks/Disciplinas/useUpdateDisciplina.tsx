import { notifications } from '@/components/ui/notification';
import { http, isApiError } from '@/lib/http';
import { UpdateDisciplinaData } from '@/types/Disciplinas';
import { useState } from 'react';

export function useUpdateDisciplina() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdateDisciplina = async (disciplinaId: number, data: UpdateDisciplinaData) => {
        setError(null);
        if (!validateData(data)) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await http.patch(`/disciplinas/${disciplinaId}`, { ...data });

            if (response.data?.success) {
                notifications.success('Disciplina atualizada com sucesso!');
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

    const validateData = (data: UpdateDisciplinaData) => {
        if (data.nome.trim() === '') {
            notifications.danger('O nome da disciplina e obrigatorio.');
            setError('O nome da disciplina e obrigatorio.');
            return false;
        }

        return true;
    };

    return { isLoading, error, handleUpdateDisciplina };
}
