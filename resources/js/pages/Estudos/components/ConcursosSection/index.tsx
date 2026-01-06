import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import EmptyState from '../common/EmptyState';
import CreateConcurso from './CreateConcurso';
import { useGetConcurso } from '@/hooks/Concursos/useGetConcurso';
import ProgressRing from './ProgressRing';
import { Button } from '@headlessui/react';

export default function ConcursosSection() {
    const { concursos, isLoading, error, fetchConcursos } = useGetConcurso();
    const hasConcursos = concursos.length > 0;
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    useEffect(() => {
        fetchConcursos();
    }, []);

    const formatDate = (value?: string | null) => {
        if (!value) {
            return 'Nao informada';
        }

        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) {
            return value;
        }

        return parsed.toLocaleDateString('pt-BR');
    };

    return (
        <>
            <CreateConcurso open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={fetchConcursos} />

            <div className="min-w-0 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900">Seus Concursos</h2>
                        <p className="mt-1 text-sm text-slate-500">Selecione um concurso para continuar estudando.</p>
                    </div>

                    {hasConcursos && (
                        <Button className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 cursor-pointer">
                            Novo concurso
                        </Button>
                    )}
                </div>
                <div className="mt-4">
                    <InputError message={error ?? undefined} />
                </div>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {isLoading ? (
                        <div className="col-span-full flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                            <Spinner />
                            Carregando concursos...
                        </div>
                    ) : !hasConcursos ? (
                        <div className="w-full">
                            <EmptyState
                                title="Cadastre um concurso para comecar"
                                action="Criar concurso"
                                onAction={() => setIsCreateOpen(true)}
                            />
                        </div>
                    ) : (
                        concursos.map((concurso) => (
                            <div
                                key={concurso.id}
                                className="group flex min-h-[200px] w-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:border-red-300 hover:shadow-lg"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-lg font-semibold text-slate-900">
                                            {concurso.nome}
                                        </div>
                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                            {concurso.orgao ? (
                                                <span className="flex items-center gap-1.5">
                                                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-red-50 text-red-600">
                                                        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M6 19h12M5 10V6l7-3 7 3v4M7 10v9m4-9v9m4-9v9" />
                                                        </svg>
                                                    </span>
                                                    {concurso.orgao}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                    <ProgressRing value={Math.round(concurso.progresso)} size={56} />
                                </div>

                                <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10m-12 9h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                                        </svg>
                                        <span className="font-medium text-slate-600">Data da prova:</span>
                                        {formatDate(concurso.data_prova)}
                                    </div>
                                    <div className="flex items-start gap-1.5">
                                        <svg viewBox="0 0 24 24" className="mt-0.5 size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h10M7 16h6M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                                        </svg>
                                        <span className="font-medium text-slate-600">Descricao:</span>
                                        <span className="line-clamp-2">
                                            {concurso.descricao ? concurso.descricao : 'Nao informada'}
                                        </span>
                                    </div>
                                </div>

                                <div className='mt-3 flex flex-col'>
                                    <Button className="rounded bg-red-500 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 cursor-pointer">
                                        Entrar
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
