import EmptyState from './EmptyState';
import type { StatusConfig, Topico } from './types';

export default function TopicosSection({
    topicos,
    statusConfig,
}: {
    topicos: Topico[];
    statusConfig: StatusConfig;
}) {
    const hasTopicos = topicos.length > 0;

    return (
        <div className="min-w-0 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Topicos</h2>
                    <p className="text-sm text-slate-500">Trabalhe a menor unidade de estudo.</p>
                </div>
                <button className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-sm">
                    Cadastrar topico
                </button>
            </div>
            <div className="mt-6 space-y-3">
                {!hasTopicos ? (
                    <EmptyState title="Cadastre um topico para iniciar" action="Cadastrar topico" />
                ) : (
                    topicos.map((topico) => (
                        <div
                            key={topico.id}
                            className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 md:flex-row md:items-center md:justify-between"
                        >
                            <div>
                                <div className="text-base font-semibold text-slate-900">{topico.nome}</div>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                    <span
                                        className={`rounded-full px-3 py-1 font-semibold ${statusConfig[topico.status].className}`}
                                    >
                                        {statusConfig[topico.status].label}
                                    </span>
                                    {topico.proximaRevisao ? (
                                        <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                                            Proxima revisao: {topico.proximaRevisao}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
                                    Estudar
                                </button>
                                <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700">
                                    Revisar
                                </button>
                                <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700">
                                    Ver historico
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
