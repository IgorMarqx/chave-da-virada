import axios, {
    type AxiosError,
    type AxiosInstance,
    AxiosHeaders,
    type InternalAxiosRequestConfig,
} from 'axios';

const TOKEN_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';
const EXPIRES_AT_STORAGE_KEY = 'auth_expires_at';
let inMemoryToken: string | null = null;
let inMemoryExpiresAt: number | null = null;

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

export const setAuthUser = (user: unknown | null): void => {
    if (typeof window === 'undefined') {
        return;
    }

    if (user == null) {
        window.localStorage.removeItem(USER_STORAGE_KEY);
        return;
    }

    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const getAuthUser = (): unknown | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw) as unknown;
    } catch {
        return null;
    }
};

const readExpiresAt = (): number | null => {
    if (typeof window === 'undefined') {
        return inMemoryExpiresAt;
    }

    const value = window.localStorage.getItem(EXPIRES_AT_STORAGE_KEY);
    if (!value) {
        return inMemoryExpiresAt;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : inMemoryExpiresAt;
};

export const setAuthExpiresIn = (expiresInSeconds: number | null): void => {
    if (expiresInSeconds == null) {
        inMemoryExpiresAt = null;
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(EXPIRES_AT_STORAGE_KEY);
        }
        return;
    }

    const expiresAt = Date.now() + expiresInSeconds * 1000;
    inMemoryExpiresAt = expiresAt;
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(EXPIRES_AT_STORAGE_KEY, String(expiresAt));
    }
};

export const getAuthExpiresAt = (): number | null => readExpiresAt();

export const isAuthExpired = (): boolean => {
    const expiresAt = readExpiresAt();
    return typeof expiresAt === 'number' && Date.now() >= expiresAt;
};

export const clearAuthSession = (): void => {
    clearAuthToken();
    setAuthUser(null);
    setAuthExpiresIn(null);
};

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
