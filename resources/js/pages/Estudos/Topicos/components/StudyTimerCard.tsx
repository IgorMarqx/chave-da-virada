import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pause, Play, RotateCcw } from 'lucide-react';
import InputError from '@/components/input-error';
import { useCreateEstudo } from '@/hooks/Estudos/useCreateEstudo';
import FinishStudyDialog from '@/pages/Estudos/Topicos/components/FinishStudyDialog';
import {
    clearCookie,
    readCookieJson,
    readLocalStorageJson,
    writeCookieJson,
    writeLocalStorageJson,
} from '@/lib/utils';

type StudyTimerCardProps = {
    topicoId: number;
    onSaved: () => void;
    onStatusChange: (status: 'Nao iniciado' | 'Estudando' | 'Pausado') => void;
};

export default function StudyTimerCard({ topicoId, onSaved, onStatusChange }: StudyTimerCardProps) {
    const { isLoading: isSaving, error, handleCreateEstudo } = useCreateEstudo();
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isHydrated, setIsHydrated] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const [offlineCount, setOfflineCount] = useState(0);
    const cookieKey = `study_timer_${topicoId}`;
    const storageKey = `study_timer_state_${topicoId}`;
    const offlineQueueKey = 'study_timer_offline_queue';

    const readOfflineQueue = () =>
        readLocalStorageJson<
            Array<{
                topico_id: number;
                tempo_segundos: number;
                data_estudo: string;
                origem: string;
            }>
        >(offlineQueueKey, []);

    const writeOfflineQueue = (queue: Array<{
        topico_id: number;
        tempo_segundos: number;
        data_estudo: string;
        origem: string;
    }>) => {
        writeLocalStorageJson(offlineQueueKey, queue);
    };

    const enqueueOffline = (payload: {
        topico_id: number;
        tempo_segundos: number;
        data_estudo: string;
        origem: string;
    }) => {
        const queue = readOfflineQueue();
        queue.push(payload);
        writeOfflineQueue(queue);
        setOfflineCount(queue.length);
    };

    const flushOfflineQueue = async () => {
        if (!navigator.onLine) {
            return;
        }

        const queue = readOfflineQueue();
        if (queue.length === 0) {
            return;
        }

        const remaining: typeof queue = [];
        for (const item of queue) {
            try {
                await handleCreateEstudo(item);
            } catch {
                remaining.push(item);
            }
        }

        writeOfflineQueue(remaining);
        setOfflineCount(remaining.length);
        if (remaining.length === 0) {
            onSaved();
        }
    };

    useEffect(() => {
        const stored = readLocalStorageJson<{
            elapsedSeconds: number;
            isRunning: boolean;
            lastTimestamp?: number;
        } | null>(storageKey, null);
        const cookieStored = readCookieJson<{
            elapsedSeconds: number;
            isRunning: boolean;
            lastTimestamp?: number;
        }>(cookieKey);

        const resolved = stored ?? cookieStored;
        if (!resolved || typeof resolved.elapsedSeconds !== 'number' || typeof resolved.isRunning !== 'boolean') {
            setIsHydrated(true);
            return;
        }

        const lastTimestamp = typeof resolved.lastTimestamp === 'number' ? resolved.lastTimestamp : Date.now();
        const extraSeconds = resolved.isRunning ? Math.floor((Date.now() - lastTimestamp) / 1000) : 0;
        const nextElapsed = Math.max(0, resolved.elapsedSeconds + extraSeconds);

        setElapsedSeconds(nextElapsed);
        setIsRunning(resolved.isRunning);
        setIsHydrated(true);
    }, [cookieKey, storageKey]);

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        const intervalId = window.setInterval(() => {
            setElapsedSeconds((prev) => prev + 1);
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [isRunning]);

    useEffect(() => {
        if (typeof navigator !== 'undefined') {
            setIsOffline(!navigator.onLine);
            setOfflineCount(readOfflineQueue().length);
        }

        flushOfflineQueue();
        const handleOnline = () => {
            setIsOffline(false);
            flushOfflineQueue();
        };
        const handleOffline = () => {
            setIsOffline(true);
        };
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        writeLocalStorageJson(storageKey, {
            elapsedSeconds,
            isRunning,
            lastTimestamp: Date.now(),
        });
        writeCookieJson(
            cookieKey,
            {
                elapsedSeconds,
                isRunning,
                lastTimestamp: Date.now(),
            },
            604800,
        );
    }, [cookieKey, elapsedSeconds, isRunning, isHydrated, storageKey]);

    const formattedElapsed = useMemo(() => {
        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const seconds = elapsedSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, [elapsedSeconds]);

    const handleStart = () => {
        if (elapsedSeconds === 0) {
            setElapsedSeconds(0);
        }

        setIsRunning(true);
        onStatusChange('Estudando');
    };

    const handlePause = () => {
        setIsRunning(false);
        onStatusChange('Pausado');
    };

    const handleFinish = async () => {
        setIsRunning(false);
        const seconds = Math.max(1, elapsedSeconds);
        const payload = {
            topico_id: topicoId,
            tempo_segundos: seconds,
            data_estudo: new Date().toISOString().slice(0, 19).replace('T', ' '),
            origem: 'manual',
        };

        if (!navigator.onLine) {
            enqueueOffline(payload);
        } else {
            await handleCreateEstudo(payload);
            onSaved();
        }

        setElapsedSeconds(0);
        onStatusChange('Nao iniciado');
        clearCookie(cookieKey);
        writeLocalStorageJson(storageKey, null);
    };

    const handleReset = () => {
        setIsRunning(false);
        setElapsedSeconds(0);
        onStatusChange('Nao iniciado');
        clearCookie(cookieKey);
        writeLocalStorageJson(storageKey, null);
    };

    const isActiveStudyMode = false;

    return (
        <Card
            className={`border-2 border-red-100 bg-white/80 backdrop-blur-sm transition-all duration-500 ease-in-out ${isActiveStudyMode ? 'mx-auto max-w-md' : 'w-full'
                }`}
        >
            <CardContent className={`transition-all duration-500 ${isActiveStudyMode ? 'py-6' : 'py-2'}`}>
                <div className="text-center">
                    <p
                        className={`text-slate-500 transition-all duration-500 ${isActiveStudyMode ? 'mb-2 text-sm' : 'mb-4 text-lg'
                            }`}
                    >
                        Tempo de Estudo
                    </p>
                    <div
                        className={`font-mono font-bold tracking-wider text-slate-900 transition-all duration-500 ${isActiveStudyMode ? 'text-5xl md:text-6xl' : 'text-6xl md:text-8xl'
                            }`}
                    >
                        {formattedElapsed}
                    </div>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {!isRunning && (
                            <Button onClick={handleStart} disabled={isSaving} className="bg-red-500 text-white hover:bg-red-600  cursor-pointer">
                                <Play className="mr-2 h-4 w-4" />
                                Estudar
                            </Button>
                        )}
                        {isRunning && (
                            <Button onClick={handlePause} className="bg-amber-500 text-white hover:bg-amber-600  cursor-pointer">
                                <Pause className="mr-2 h-4 w-4" />
                                Pausar
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            className="bg-transparent cursor-pointer"
                            disabled={elapsedSeconds === 0}
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reiniciar
                        </Button>
                        <FinishStudyDialog
                            disabled={elapsedSeconds === 0 || isSaving}
                            isSaving={isSaving}
                            onConfirm={handleFinish}
                        />
                    </div>
                    {(isOffline || offlineCount > 0) && (
                        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                            {isOffline
                                ? 'Sem internet. Se finalizar, o estudo sera salvo localmente.'
                                : `Envios pendentes: ${offlineCount}. Enviaremos automaticamente quando houver conexao.`}
                        </div>
                    )}
                    <div className="mt-4">
                        <InputError message={error ?? undefined} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
