import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import InputError from '@/components/input-error';
import EmptyState from '../Estudos/components/common/EmptyState';
import { useGetRevisoesHoje } from '@/hooks/Revisoes/useGetRevisoesHoje';
import { useConcluirRevisao } from '@/hooks/Revisoes/useConcluirRevisao';
import { useIniciarRevisao } from '@/hooks/Revisoes/useIniciarRevisao';
import { Button } from '@/components/ui/button';
import ConfirmConcluirRevisaoDialog from '@/pages/Revisao/components/ConfirmConcluirRevisaoDialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Revisao', href: '/estudos/revisao' },
];

const formatDateTime = (value?: string | null): string => {
    if (!value) {
        return 'Nao informado';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }

    return parsed.toLocaleString('pt-BR');
};

export default function RevisaoHoje() {
    const { revisoes, isLoading, error, fetchRevisoesHoje } = useGetRevisoesHoje();
    const { concluirRevisao, isSaving } = useConcluirRevisao();
    const { iniciarRevisao, isSaving: isStarting } = useIniciarRevisao();
    const [confirmRevisaoId, setConfirmRevisaoId] = useState<number | null>(null);

    useEffect(() => {
        fetchRevisoesHoje();
    }, [fetchRevisoesHoje]);

    const handleConcluir = async (revisaoId: number) => {
        const saved = await concluirRevisao(revisaoId);
        if (saved) {
            fetchRevisoesHoje();
        }
    };

    const handleIniciar = async (revisaoId: number, topicoId?: number | null) => {
        if (!topicoId) {
            return;
        }

        const saved = await iniciarRevisao(revisaoId);
        if (saved) {
            router.visit(`/revisao/${topicoId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Revisao" />

            <div className="flex h-full w-full min-w-0 flex-1 flex-col gap-6 overflow-x-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-red-50 to-rose-50 p-6">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Revisao do dia</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {revisoes.length} topico{revisoes.length === 1 ? '' : 's'} para revisar
                    </p>
                </div>

                <InputError message={error ?? undefined} />

                {isLoading ? (
                    <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                        <Spinner />
                        Carregando revisoes...
                    </div>
                ) : revisoes.length === 0 ? (
                    <EmptyState
                        title="Nenhuma revisao pendente hoje"
                        action="Atualizar lista"
                        onAction={() => fetchRevisoesHoje()}
                    />
                ) : (
                    <div className="flex flex-wrap items-stretch gap-4">
                        {revisoes.map((revisao) => {
                            const topico = revisao.topico;
                            const disciplina = topico?.disciplina;
                            const concurso = disciplina?.concurso;
                            const isEmAndamento = revisao.status === 'em_andamento';

                            return (
                                <div
                                    key={revisao.id}
                                    className="flex min-w-[260px] flex-1 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div>
                                        <div className="text-xs font-semibold uppercase tracking-wide text-rose-500">
                                            {disciplina?.nome ?? 'Disciplina'}
                                        </div>
                                        <h2 className="mt-2 text-lg font-semibold text-slate-900">
                                            {topico?.nome ?? 'Topico'}
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Concurso: {concurso?.nome ?? 'Nao informado'}
                                        </p>
                                        <p className="mt-2 text-xs text-slate-400">
                                            Revisao em {formatDateTime(revisao.data_revisao)}
                                        </p>
                                    </div>

                                    {isEmAndamento ? (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => router.visit(`/revisao/${topico?.id ?? ''}`)}
                                                disabled={!topico?.id}
                                                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 cursor-pointer"
                                            >
                                                Continuar revisao
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setConfirmRevisaoId(revisao.id)}
                                                disabled={isSaving}
                                                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 cursor-pointer"
                                            >
                                                {isSaving ? 'Concluindo...' : 'Concluir revisao'}
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleIniciar(revisao.id, topico?.id)}
                                            disabled={isStarting}
                                            className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 cursor-pointer"
                                        >
                                            {isStarting ? 'Iniciando...' : 'Começar revisao'}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <ConfirmConcluirRevisaoDialog
                open={confirmRevisaoId !== null}
                isSaving={isSaving}
                onOpenChange={(open) => !open && setConfirmRevisaoId(null)}
                onConfirm={async () => {
                    if (confirmRevisaoId === null) {
                        return;
                    }
                    const revisaoId = confirmRevisaoId;
                    setConfirmRevisaoId(null);
                    await handleConcluir(revisaoId);
                }}
            />
        </AppLayout>
    );
}
