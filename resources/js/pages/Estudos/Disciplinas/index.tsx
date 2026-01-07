import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import EmptyState from '../components/common/EmptyState';
import { useGetTopicosByDisciplina } from '@/hooks/Topicos/useGetTopicosByDisciplina';
import CreateTopico from './components/CreateTopico';

type Disciplina = {
    id: number;
    nome: string;
    concurso_id: number;
};

type PageProps = {
    disciplina: Disciplina;
};

export default function DisciplinaTopicos({ disciplina }: PageProps) {
    const { topicos, isLoading, error, fetchTopicos } = useGetTopicosByDisciplina();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    useEffect(() => {
        fetchTopicos(disciplina.id);
    }, [disciplina.id, fetchTopicos]);

    const formatDateTime = (value?: string | null) => {
        if (!value) {
            return '';
        }

        return new Date(value).toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Estudos', href: '/estudos' },
        { title: 'Disciplinas', href: `/estudos/concursos/${disciplina.concurso_id}` },
        { title: disciplina.nome, href: `/estudos/disciplinas/${disciplina.id}` },
    ];

    const statusConfig = {
        'nao-iniciado': {
            label: 'Nao iniciado',
            className: 'bg-slate-100 text-slate-600',
        },
        'em-andamento': {
            label: 'Em andamento',
            className: 'bg-rose-100 text-rose-700',
        },
        concluido: {
            label: 'Concluido',
            className: 'bg-red-100 text-red-700',
        },
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Topicos - ${disciplina.nome}`} />

            <div className="flex h-full w-full min-w-0 flex-1 flex-col gap-6 overflow-x-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-red-50 to-rose-50 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">
                            Topicos de {disciplina.nome}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {topicos.length} topicos cadastrados
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-950"
                        >
                            Criar topico
                        </Button>
                        <Link
                            href={`/estudos/concursos/${disciplina.concurso_id}`}
                            className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                        >
                            Voltar
                        </Link>
                    </div>
                </div>

                <InputError message={error ?? undefined} />
                <CreateTopico
                    disciplinaId={disciplina.id}
                    open={isCreateOpen}
                    onOpenChange={setIsCreateOpen}
                    onSuccess={() => fetchTopicos(disciplina.id)}
                />

                {isLoading ? (
                    <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                        <Spinner />
                        Carregando topicos...
                    </div>
                ) : topicos.length === 0 ? (
                    <EmptyState
                        title="Nenhum topico encontrado"
                        action="Criar topico"
                        onAction={() => setIsCreateOpen(true)}
                    />
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {topicos.map((topico) => (
                            <div
                                key={topico.id}
                                className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-sm transition hover:border-slate-200 hover:shadow-md md:flex-row md:items-center md:justify-between"
                            >
                                <div>
                                    <div className="text-base font-semibold text-slate-900">
                                        {topico.nome}
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                        {topico.ultima_atividade ? (
                                            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                                                Última atividade: {formatDateTime(topico.ultima_atividade)}
                                            </span>
                                        ) : null}
                                        {topico.proxima_revisao ? (
                                            <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                                                Próxima revisão: {formatDateTime(topico.proxima_revisao)}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        href={`/estudos/topicos/${topico.id}`}
                                        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
                                    >
                                        Estudar
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
