import EmptyState from './EmptyState';
import type { Disciplina } from './types';

export default function DisciplinasSection({ disciplinas }: { disciplinas: Disciplina[] }) {
    const hasDisciplinas = disciplinas.length > 0;

    return (
        <div className="min-w-0 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Disciplinas</h2>
                    <p className="mt-1 text-sm text-slate-500">{disciplinas.length} disciplinas cadastradas</p>
                </div>
                <button className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600">
                    Nova disciplina
                </button>
            </div>
            <div className="mt-6 flex flex-wrap items-stretch gap-4">
                {!hasDisciplinas ? (
                    <EmptyState title="Cadastre uma disciplina para continuar" action="Cadastrar disciplina" />
                ) : (
                    disciplinas.map((disciplina) => (
                        <button
                            key={disciplina.id}
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
                                <div className="mt-0.5 text-sm text-slate-500">{disciplina.topicos} topicos</div>
                            </div>
                            <div className="flex w-full items-center gap-3 sm:w-auto">
                                <div className="h-2 w-full min-w-[120px] rounded-full bg-slate-100 sm:w-24">
                                    <div
                                        className="h-full rounded-full bg-red-500 transition duration-500"
                                        style={{ width: `${disciplina.progresso}%` }}
                                    />
                                </div>
                                <span className="w-10 text-sm font-medium text-slate-500">{disciplina.progresso}%</span>
                                <svg viewBox="0 0 24 24" className="size-4 text-slate-400 transition group-hover:text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                                </svg>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
