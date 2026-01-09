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

const reverbKey = import.meta.env.VITE_REVERB_APP_KEY;
const reverbHost = import.meta.env.VITE_REVERB_HOST;
const reverbPort = Number(import.meta.env.VITE_REVERB_PORT || 80);
const reverbScheme = import.meta.env.VITE_REVERB_SCHEME || 'http';

console.log(reverbKey, reverbHost, reverbPort, reverbScheme);
const token = isBrowser ? getAuthToken() : null;

export const echo =
    isBrowser && reverbKey && reverbHost
        ? new Echo({
            broadcaster: 'reverb',
            key: reverbKey,
            wsHost: reverbHost,
            wsPort: reverbPort,
            wssPort: reverbPort,
            forceTLS: reverbScheme === 'https',
            enabledTransports: ['ws', 'wss'],
            authEndpoint: '/api/broadcasting/auth',
            ...(token
                ? {
                    auth: {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/json',
                        },
                    },
                }
                : {}),
        })
        : null;

if (echo) {
    const pusher = (echo.connector as { pusher?: Pusher }).pusher;
    if (pusher) {
        pusher.connection.bind('error', (error: unknown) => {
            console.error('[reverb] connection error', error);
        });
        pusher.connection.bind('connected', () => {
            console.info('[reverb] connected');
        });
        pusher.connection.bind('disconnected', () => {
            console.warn('[reverb] disconnected');
        });
    }
}
