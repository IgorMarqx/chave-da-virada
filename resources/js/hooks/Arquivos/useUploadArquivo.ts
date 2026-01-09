import { useState } from 'react';
import { http, isApiError } from '@/lib/http';
import type { Arquivo } from './useArquivosByTopico';
import { notifications } from '@/components/ui/notification';

type UploadPayload = {
    topicoId: number;
    tipo: 'pdf' | 'doc' | 'image';
    file: File;
};

type UploadResult = {
    queued: boolean;
    arquivo: Arquivo | null;
};

export function useUploadArquivo() {
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadArquivo = async ({ topicoId, tipo, file }: UploadPayload) => {
        setError(null);
        setIsUploading(true);
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('topico_id', String(topicoId));
            formData.append('tipo', tipo);
            formData.append('file', file);

            const response = await http.post('/arquivos', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const arquivo = (response.data?.data ?? null) as Arquivo | null;

            if (response.status === 202) {
                notifications.info('Seu arquivo está na fila de processamento. Você será notificado quando estiver pronto.');
                return {
                    queued: response.status === 202,
                    arquivo,
                } satisfies UploadResult;
            }
        } catch (err) {
            if (isApiError(err)) {
                if (err.response?.data?.message) {
                    setError(err.response.data.message);
                    notifications.danger(err.response.data.message);
                    return null;
                }
            }
            setError('An unexpected error occurred. Please try again.');
            return null;
        } finally {
            setIsUploading(false);
            setIsLoading(false);
        }
    };

    return { uploadArquivo, isUploading, error, isLoading };
}
