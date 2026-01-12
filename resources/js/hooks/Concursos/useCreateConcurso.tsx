import { notifications } from "@/components/ui/notification";
import { http, isApiError } from "@/lib/http";
import { CreateConcursoData } from "@/types/Concursos";
import { useState } from "react";

export function useCreateConcurso() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleCreateConcurso = async (data: CreateConcursoData) => {
        setError(null);
        setIsSuccess(false)
        if (!validateData(data)) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await http.post('/concursos/create', { ...data });

            if (response.data.success) {
                notifications.success('Concurso criado com sucesso!');
                setIsSuccess(true);
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
    }

    const validateData = (data: CreateConcursoData) => {
        if (data.nome.trim() === '') {
            notifications.danger('O nome do concurso é obrigatório.');
            setError('O nome do concurso é obrigatório.');
            return false;
        }

        if (data.orgao.trim() === '') {
            notifications.danger('O órgão do concurso é obrigatório.');
            setError('O órgão do concurso é obrigatório.');
            return false;
        }

        return true;
    }

    return { isLoading, error, handleCreateConcurso, isSuccess };
}