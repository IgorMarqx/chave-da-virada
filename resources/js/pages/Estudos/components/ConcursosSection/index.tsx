import EmptyState from '../common/EmptyState';
import CreateConcurso from './CreateConcurso';
import ProgressRing from './ProgressRing';
import type { Concurso } from '../../types';

export default function ConcursosSection({ concursos }: { concursos: Concurso[] }) {
    const hasConcursos = concursos.length > 0;

    return (
        <div className="min-w-0 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Seus Concursos</h2>
                    <p className="mt-1 text-sm text-slate-500">Selecione um concurso para continuar estudando.</p>
                </div>
                <CreateConcurso
                    onClose={() => console.log('fechou')}
                />
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {!hasConcursos ? (
                    <div className="w-full">
                        <EmptyState title="Cadastre um concurso para comecar" action="Criar concurso" />
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
                                        {concurso.banca ? (
                                            <span className="flex items-center gap-1.5">
                                                <span className="inline-flex size-6 items-center justify-center rounded-full bg-red-50 text-red-600">
                                                    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.8-5.4 2.8 1-6-4.4-4.3 6.1-.9L12 3z" />
                                                    </svg>
                                                </span>
                                                {concurso.banca}
                                            </span>
                                        ) : null}
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
                                <ProgressRing value={concurso.progresso} size={56} />
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10m-12 9h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                                    </svg>
                                    {concurso.ultimaAtividade}
                                </span>
                                <button className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50">
                                    Entrar
                                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
