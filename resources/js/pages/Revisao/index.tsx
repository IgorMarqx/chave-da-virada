import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';
import InputError from '@/components/input-error';
import EmptyState from '../Estudos/components/common/EmptyState';
import { useGetRevisoesHoje } from '@/hooks/Revisoes/useGetRevisoesHoje';
import { useConcluirRevisao } from '@/hooks/Revisoes/useConcluirRevisao';

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

    useEffect(() => {
        fetchRevisoesHoje();
    }, [fetchRevisoesHoje]);

    const handleConcluir = async (revisaoId: number) => {
        const saved = await concluirRevisao(revisaoId);
        if (saved) {
            fetchRevisoesHoje();
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

                                    <button
                                        type="button"
                                        onClick={() => handleConcluir(revisao.id)}
                                        disabled={isSaving}
                                        className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                                    >
                                        {isSaving ? 'Concluindo...' : 'Concluir revisao'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
