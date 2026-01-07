import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { useGetTopico } from '@/hooks/Topicos/useGetTopico';
import { useGetEstudosByTopico } from '@/hooks/Estudos/useGetEstudosByTopico';
import StudyHeader from './components/StudyHeader';
import StudyTimerCard from './components/StudyTimerCard';
import StudyActionsCard from './components/StudyActionsCard';
import StudyFilesCard from './components/StudyFilesCard';
import StudyHistoryCard from './components/StudyHistoryCard';
import StudyNotesCard from './components/StudyNotesCard';
import { readLocalStorageJson, writeLocalStorageJson } from '@/lib/utils';
import { useGetAnotacaoByTopico } from '@/hooks/Anotacoes/useGetAnotacaoByTopico';

type TopicoRef = {
    id: number;
    nome: string;
    disciplina_id: number;
    concurso_id: number | null;
};

type PageProps = {
    topico: TopicoRef;
};

export default function TopicoDetalhe({ topico }: PageProps) {
    const { topico: topicoDetalhe, isLoading, error, fetchTopico } = useGetTopico();
    const { estudos, isLoading: isLoadingEstudos, error: errorEstudos, fetchEstudos } = useGetEstudosByTopico();
    const { anotacao, fetchAnotacao } = useGetAnotacaoByTopico();

    const [studyStatus, setStudyStatus] = useState<'Nao iniciado' | 'Estudando' | 'Pausado'>('Nao iniciado');
    const [notes, setNotes] = useState('');
    const studyStatusKey = `study_status_${topico.id}`;
    const timerStateKey = `study_timer_state_${topico.id}`;
    const [saveAnotacoes, setSaveAnotacoes] = useState(false);

    useEffect(() => {
        fetchTopico(topico.id);
        fetchEstudos(topico.id);
        fetchAnotacao(topico.id);
    }, []);

    useEffect(() => {
        if (anotacao?.conteudo) {
            setNotes(anotacao.conteudo);
        }
    }, [anotacao]);

    useEffect(() => {
        const storedStatus = readLocalStorageJson<'Nao iniciado' | 'Estudando' | 'Pausado' | null>(studyStatusKey, null);
        const timerState = readLocalStorageJson<{
            elapsedSeconds: number;
            isRunning: boolean;
            lastTimestamp?: number;
        } | null>(timerStateKey, null);

        if (timerState?.isRunning) {
            setStudyStatus('Estudando');
            return;
        }

        if (timerState && timerState.elapsedSeconds > 0) {
            setStudyStatus('Pausado');
            return;
        }

        if (storedStatus) {
            setStudyStatus(storedStatus);
        }
    }, [studyStatusKey, timerStateKey]);

    useEffect(() => {
        writeLocalStorageJson(studyStatusKey, studyStatus);
    }, [studyStatus, studyStatusKey]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Estudos', href: '/estudos' },
        { title: 'Disciplinas', href: `/estudos/concursos/${topico.concurso_id ?? ''}` },
        { title: topico.nome, href: `/estudos/topicos/${topico.id}` },
    ];

    const isActiveStudyMode = studyStatus !== 'Nao iniciado';

    const handleSaveAnotacoes = () => {
        setSaveAnotacoes(true);

        setTimeout(() => {
            setSaveAnotacoes(false);
        }, 500);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Topico - ${topico.nome}`} />

            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-sky-50">
                <div className="container mx-auto max-w-6xl px-4 py-8">
                    <StudyHeader
                        title={topico.nome}
                        description={topicoDetalhe?.descricao ?? 'Topico de estudo'}
                        status={studyStatus}
                    />

                    <div className="mt-6">
                        <InputError message={error ?? undefined} />
                    </div>

                    {isLoading ? (
                        <div className="mt-2 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                            <Spinner />
                            Carregando topico...
                        </div>
                    ) : (
                        <div className="mt-2 flex flex-col">
                            <div className={isActiveStudyMode ? 'order-2' : 'order-1'}>
                                <div className={isActiveStudyMode ? 'grid gap-2 md:grid-cols-2' : ''}>
                                    <StudyTimerCard
                                        topicoId={topico.id}
                                        onSaved={() => {
                                            fetchEstudos(topico.id).then(() => fetchTopico(topico.id));
                                            handleSaveAnotacoes()
                                        }}
                                        onStatusChange={setStudyStatus}
                                    />
                                    {isActiveStudyMode && <StudyFilesCard topicoId={topico.id} />}
                                </div>
                            </div>

                            <div className={isActiveStudyMode ? 'order-1' : 'order-2'}>
                                <StudyNotesCard
                                    notes={notes}
                                    onNotesChange={setNotes}
                                    topicoId={topico.id}
                                    isActive={isActiveStudyMode}
                                    savedAnotacoes={saveAnotacoes}
                                />
                                <div className={`mt-2 grid gap-6 transition-all duration-500 ease-in-out ${isActiveStudyMode ? 'md:mx-auto md:max-w-md md:grid-cols-1' : 'md:grid-cols-3'}`}>
                                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isActiveStudyMode ? 'max-h-0 opacity-0 hidden' : 'max-h-[400px] opacity-100'}`}>
                                        <StudyActionsCard
                                            onReview={() => router.visit(`/estudos/topicos/${topico.id}/revisao`)}
                                        />
                                    </div>

                                    {!isActiveStudyMode && <StudyFilesCard topicoId={topico.id} />}

                                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isActiveStudyMode ? 'max-h-0 opacity-0 hidden' : 'max-h-[400px] opacity-100'}`}>
                                        <StudyHistoryCard
                                            estudos={estudos}
                                            isLoading={isLoadingEstudos}
                                            error={errorEstudos}
                                            notesHtml={notes}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
