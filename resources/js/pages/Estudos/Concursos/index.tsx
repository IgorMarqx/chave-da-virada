import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import EmptyState from '../components/common/EmptyState';
import CreateDisciplina from './components/CreateDisciplina';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import InputError from '@/components/input-error';
import { useGetDisciplinasByConcurso } from '@/hooks/Disciplinas/useGetDisciplinasByConcurso';
import { Button } from '@headlessui/react';

type Disciplina = {
    id: number;
    nome: string;
    concurso_id: number;
    topicos?: number;
    progresso?: number;
};

type Concurso = {
    id: number;
    nome: string;
};

type PageProps = {
    concurso: Concurso;
};

export default function ConcursoDisciplinas({ concurso }: PageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { disciplinas, isLoading, error, fetchDisciplinas } = useGetDisciplinasByConcurso();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Estudos', href: '/estudos' },
        { title: concurso.nome, href: `/estudos/concursos/${concurso.id}` },
    ];

    useEffect(() => {
        fetchDisciplinas(concurso.id);
    }, [concurso.id, fetchDisciplinas]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Disciplinas - ${concurso.nome}`} />

            <CreateDisciplina
                open={isOpen}
                onOpenChange={setIsOpen}
                concursoId={concurso.id}
                onSuccess={() => fetchDisciplinas(concurso.id)}
            />

            <div className="flex h-full w-full min-w-0 flex-1 flex-col gap-6 overflow-x-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-red-50 to-rose-50 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">
                            Disciplinas de {concurso.nome}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {disciplinas.length} disciplinas cadastradas
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 cursor-pointer" onClick={() => setIsOpen(true)}>Criar disciplina</Button>
                        <Link
                            href="/estudos"
                            className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 cursor-pointer"
                        >
                            Voltar
                        </Link>
                    </div>
                </div>

                <InputError message={error ?? undefined} />

                {isLoading ? (
                    <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                        <Spinner />
                        Carregando disciplinas...
                    </div>
                ) : disciplinas.length === 0 ? (
                    <EmptyState
                        title="Nenhuma disciplina encontrada"
                        action="Criar disciplina"
                        onAction={() => {
                            setIsOpen(true);
                        }}
                    />
                ) : (
                    <div className="flex flex-wrap items-stretch gap-4">
                        {disciplinas.map((disciplina) => (
                            <Link
                                key={disciplina.id}
                                href={`/estudos/disciplinas/${disciplina.id}`}
                                className="group flex min-h-[104px] flex-1 flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition duration-300 hover:border-red-300 hover:shadow-md"
                            >
                                <div className="flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 5.75h11.25a1 1 0 0 1 1 1v12.5a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1V6.75a1 1 0 0 1 1-1z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 4.5h7.5" />
                                    </svg>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="whitespace-normal break-words text-base font-semibold leading-snug text-slate-900">
                                        {disciplina.nome}
                                    </div>
                                    <div className="mt-0.5 text-sm text-slate-500">
                                        {disciplina.topicos ?? 0} topicos
                                    </div>
                                </div>
                                <div className="flex w-full items-center gap-3 sm:w-auto">
                                    <div className="h-2 w-full min-w-[120px] rounded-full bg-slate-100 sm:w-24">
                                        <div
                                            className="h-full rounded-full bg-red-500 transition duration-500"
                                            style={{ width: `${disciplina.progresso ?? 0}%` }}
                                        />
                                    </div>
                                    <span className="w-10 text-sm font-medium text-slate-500">
                                        {disciplina.progresso ?? 0}%
                                    </span>
                                    <svg viewBox="0 0 24 24" className="size-4 text-slate-400 transition group-hover:text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout >
    );
}
