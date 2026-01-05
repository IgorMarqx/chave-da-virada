import axios, {
    type AxiosError,
    type AxiosInstance,
    AxiosHeaders,
    type InternalAxiosRequestConfig,
} from 'axios';

const TOKEN_STORAGE_KEY = 'auth_token';
let inMemoryToken: string | null = null;

const readToken = (): string | null => {
    if (typeof window === 'undefined') {
        return inMemoryToken;
    }

    return window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? inMemoryToken;
};

export const setAuthToken = (token: string | null): void => {
    inMemoryToken = token;

    if (typeof window === 'undefined') {
        return;
    }

    if (token) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
};

export const clearAuthToken = (): void => setAuthToken(null);
export const getAuthToken = (): string | null => readToken();

const attachToken = (
    config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
    const token = readToken();

    const headers = AxiosHeaders.from(config.headers);
    if (!headers.has('Accept')) {
        headers.set('Accept', 'application/json');
    }

    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    return { ...config, headers };
};

const http: AxiosInstance = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

http.interceptors.request.use(attachToken);

http.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            const config = error.config as
                | (InternalAxiosRequestConfig & { _handled401?: boolean })
                | undefined;
            if (config?._handled401) {
                return Promise.reject(error);
            }
            if (config) {
                config._handled401 = true;
            }

            clearAuthToken();

            if (typeof window !== 'undefined') {
                void axios.post(
                    '/api/auth/logout',
                    {},
                    { withCredentials: true, headers: { Accept: 'application/json' } },
                );
                window.dispatchEvent(new CustomEvent('auth:unauthorized'));
                if (!window.location.pathname.startsWith('/login')) {
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    },
);

export const isApiError = (
    error: unknown,
): error is AxiosError<{
    success?: boolean;
    message?: string;
    data?: unknown;
    errors?: Record<string, string[]> | null;
}> => axios.isAxiosError(error);

export { http };
