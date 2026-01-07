import { useState } from 'react';
import { http, isApiError } from '@/lib/http';

export function useDeleteArquivo() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteArquivo = async (arquivoId: number) => {
        setError(null);
        setIsDeleting(true);

        try {
            await http.delete(`/arquivos/${arquivoId}`);
            return true;
        } catch (err) {
            if (isApiError(err)) {
                if (err.response?.data?.message) {
                    setError(err.response.data.message);
                    return false;
                }
            }
            setError('An unexpected error occurred. Please try again.');
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    return { deleteArquivo, isDeleting, error };
}
