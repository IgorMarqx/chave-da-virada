export default function EstudoRevisaoCard() {
    return (
        <div className="min-w-0 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Estudo e revisao</h2>
            <p className="text-sm text-slate-500">Tela simples e focada para anotar e anexar arquivos.</p>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold text-slate-500">Editor focado</div>
                <div className="mt-2 h-28 rounded-xl border border-dashed border-slate-300 bg-white"></div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <button className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white">
                        Finalizar estudo
                    </button>
                    <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700">
                        Anexar arquivo
                    </button>
                </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1">PDF</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">Excel</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">Imagem</span>
            </div>
        </div>
    );
}
