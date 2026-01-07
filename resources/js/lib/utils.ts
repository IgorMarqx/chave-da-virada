import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isSameUrl(
    url1: NonNullable<InertiaLinkProps['href']>,
    url2: NonNullable<InertiaLinkProps['href']>,
) {
    return resolveUrl(url1) === resolveUrl(url2);
}

export function resolveUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function formatDate(value?: string | null): string {
    if (!value) {
        return 'Nao informada';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }

    return parsed.toLocaleDateString('pt-BR');
}

export function readCookieJson<T>(key: string): T | null {
    const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`));
    if (!match) {
        return null;
    }

    try {
        return JSON.parse(decodeURIComponent(match[1])) as T;
    } catch {
        return null;
    }
}

export function writeCookieJson<T>(key: string, payload: T, maxAgeSeconds: number) {
    const value = encodeURIComponent(JSON.stringify(payload));
    document.cookie = `${key}=${value}; path=/; max-age=${maxAgeSeconds}`;
}

export function clearCookie(key: string) {
    document.cookie = `${key}=; path=/; max-age=0`;
}

export function readLocalStorageJson<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) {
            return fallback;
        }
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

export function writeLocalStorageJson<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function formatDuration(totalSecondsValue: number) {
    const safeSeconds = Math.max(0, Math.floor(totalSecondsValue));
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
