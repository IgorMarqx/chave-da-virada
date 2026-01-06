export default function HistoricoIaCard() {
    return (
        <div className="min-w-0 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Historico + IA</h2>
            <p className="text-sm text-slate-500">Registro automatico e apoio inteligente.</p>
            <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-100 bg-white p-4">
                    <div className="text-xs font-semibold text-slate-500">Hoje</div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">
                        Estudo concluido: Controle de constitucionalidade
                    </div>
                    <div className="text-xs text-slate-500">Revisao agendada para 7 dias</div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-4">
                    <div className="text-xs font-semibold text-slate-500">Ontem</div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">Revisao feita: Direitos fundamentais</div>
                    <div className="text-xs text-slate-500">Tempo total: 38 min</div>
                </div>
                <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
                    <div className="text-xs font-semibold text-red-600">IA</div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">Sugestao rapida</div>
                    <div className="text-xs text-slate-600">
                        Priorize os topicos com revisao pendente para manter a curva de memoria.
                    </div>
                </div>
            </div>
        </div>
    );
}
