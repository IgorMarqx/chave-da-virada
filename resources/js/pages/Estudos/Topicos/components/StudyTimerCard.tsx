import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pause, Play, RotateCcw } from 'lucide-react';
import InputError from '@/components/input-error';
import { useCreateEstudo } from '@/hooks/Estudos/useCreateEstudo';
import FinishStudyDialog from '@/pages/Estudos/Topicos/components/FinishStudyDialog';

type StudyTimerCardProps = {
    topicoId: number;
    onSaved: () => void;
    onStatusChange: (status: 'Nao iniciado' | 'Estudando' | 'Pausado') => void;
};

export default function StudyTimerCard({ topicoId, onSaved, onStatusChange }: StudyTimerCardProps) {
    const { isLoading: isSaving, error, handleCreateEstudo } = useCreateEstudo();
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        const intervalId = window.setInterval(() => {
            setElapsedSeconds((prev) => prev + 1);
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [isRunning]);

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

        await handleCreateEstudo({
            topico_id: topicoId,
            tempo_segundos: seconds,
            data_estudo: new Date().toISOString().slice(0, 19).replace('T', ' '),
            origem: 'manual',
        });

        setElapsedSeconds(0);
        onStatusChange('Nao iniciado');
        onSaved();
    };

    const handleReset = () => {
        setIsRunning(false);
        setElapsedSeconds(0);
        onStatusChange('Nao iniciado');
    };

    const isActiveStudyMode = isRunning || elapsedSeconds > 0;

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
                    <div className="mt-4">
                        <InputError message={error ?? undefined} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
