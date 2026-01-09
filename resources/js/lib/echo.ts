import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { getAuthToken } from '@/lib/http';

declare global {
    interface Window {
        Pusher?: typeof Pusher;
    }
}

const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
    window.Pusher = Pusher;
}

type ReverbConfig = {
    key: string | null;
    host: string | null;
    port: number;
    scheme: string | null;
};

let echoInstance: Echo | null = null;
let echoPromise: Promise<Echo | null> | null = null;

const bindEchoLogs = (echo: Echo): void => {
    const pusher = (echo.connector as { pusher?: Pusher }).pusher;
    if (!pusher) {
        return;
    }

    pusher.connection.bind('error', (error: unknown) => {
        console.error('[reverb] connection error', error);
    });
    pusher.connection.bind('connected', () => {
        console.info('[reverb] connected');
    });
    pusher.connection.bind('disconnected', () => {
        console.warn('[reverb] disconnected');
    });
};

const fetchReverbConfig = async (): Promise<ReverbConfig | null> => {
    const token = getAuthToken();
    if (!token) {
        console.warn('[reverb] token ausente para buscar config');
        return null;
    }

    const response = await fetch('/api/reverb-config', {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        console.error('[reverb] erro ao buscar config', response.status);
        return null;
    }

    const payload = (await response.json()) as { data?: ReverbConfig };
    return payload.data ?? null;
};

export const getEcho = async (): Promise<Echo | null> => {
    if (!isBrowser) {
        return null;
    }

    if (echoInstance) {
        return echoInstance;
    }

    if (!echoPromise) {
        echoPromise = (async () => {
            const config = await fetchReverbConfig();
            if (!config?.key || !config?.host) {
                return null;
            }

            const echo = new Echo({
                broadcaster: 'reverb',
                key: config.key,
                wsHost: config.host,
                wsPort: config.port,
                wssPort: config.port,
                forceTLS: config.scheme === 'https',
                enabledTransports: ['ws', 'wss'],
                authEndpoint: '/api/broadcasting/auth',
                auth: {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                        Accept: 'application/json',
                    },
                },
            });

            bindEchoLogs(echo);
            echoInstance = echo;

            return echo;
        })();
    }

    return echoPromise;
};
