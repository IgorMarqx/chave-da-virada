export default function HeaderSection() {
    return (
        <section className="min-w-0 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
                        Sistema de estudos
                    </div>
                    <h1 className="text-3xl font-semibold text-slate-900">Estudos</h1>
                    <p className="mt-2 max-w-xl text-sm text-slate-600">
                        Siga o fluxo com o minimo de esforço. Escolha um concurso, avance por disciplina e foque no
                        topico certo.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {['Concurso', 'Disciplina', 'Topico', 'Estudo', 'Historico + IA'].map((item) => (
                        <span
                            key={item}
                            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
