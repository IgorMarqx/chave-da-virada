import { useState } from 'react';
import { http, isApiError } from '@/lib/http';

type UpdatePasswordPayload = {
    password: string;
    password_confirmation: string;
};

export function useUpdatePassword() {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const updatePassword = async (payload: UpdatePasswordPayload) => {
        setError(null);
        setIsSaving(true);

        try {
            await http.patch('/user-password', payload);
            return true;
        } catch (err) {
            if (isApiError(err)) {
                const errors = err.response?.data?.errors;
                if (errors && typeof errors === 'object') {
                    const mapped = Object.entries(errors).reduce<Record<string, string>>(
                        (acc, [key, messages]) => {
                            acc[key] = Array.isArray(messages) ? messages[0] : String(messages);
                            return acc;
                        },
                        {},
                    );
                    setFieldErrors(mapped);
                }
                if (err.response?.data?.message) {
                    setError(err.response.data.message);
                    return false;
                }
            }
            setError('An unexpected error occurred. Please try again.');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return { updatePassword, isSaving, error, fieldErrors };
}
