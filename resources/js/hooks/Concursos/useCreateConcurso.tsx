import { notifications } from "@/components/ui/notification";
import { isApiError } from "@/lib/http";
import { useState } from "react";

export function useCreateConcurso() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    try {
        
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