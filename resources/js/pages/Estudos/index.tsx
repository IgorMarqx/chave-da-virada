import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { concursos, disciplinas, statusConfig, topicos } from './data';
import DisciplinasSection from './components/DisciplinasSection';
import EstudoRevisaoCard from './components/EstudoRevisaoCard';
import HeaderSection from './components/HeaderSection';
import HistoricoIaCard from './components/HistoricoIaCard';
import TopicosSection from './components/TopicosSection';
import ConcursosSection from './components/ConcursosSection';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Estudos',
        href: '#',
    },
];

export default function Estudos() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Estudos" />
            <div className="flex h-full w-full min-w-0 flex-1 flex-col gap-6 overflow-x-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-red-50 to-rose-50 p-6">
                <HeaderSection />

                <section className="grid min-w-0 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <ConcursosSection />
                    <DisciplinasSection />
                </section>

                <section className="grid min-w-0 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <TopicosSection topicos={topicos} statusConfig={statusConfig} />

                    <div className="min-w-0 space-y-6">
                        <EstudoRevisaoCard />
                        <HistoricoIaCard />
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
