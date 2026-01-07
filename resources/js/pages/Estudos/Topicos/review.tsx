import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft, BookOpen, Expand, FileText, NotebookPen, Upload } from 'lucide-react';
import { useGetTopico } from '@/hooks/Topicos/useGetTopico';
import { useGetEstudosByTopico } from '@/hooks/Estudos/useGetEstudosByTopico';
import { useGetAnotacaoByTopico } from '@/hooks/Anotacoes/useGetAnotacaoByTopico';
import { NotesModal } from '@/pages/Estudos/Topicos/reviewComponents/NotesModal';
import { SessionSummaryCard } from '@/pages/Estudos/Topicos/reviewComponents/SessionSummaryCard';
import NotesSummaryCard from './reviewComponents/NotesSummaryCard';
import StudyFilesCard from './components/StudyFilesCard';

type TopicoRef = {
    id: number;
    nome: string;
    disciplina_id: number;
    concurso_id: number | null;
};

type PageProps = {
    topico: TopicoRef;
};

export default function TopicoRevisao({ topico }: PageProps) {
    const { topico: topicoDetalhe, fetchTopico } = useGetTopico();
    const { estudos, isLoading: isLoadingEstudos, fetchEstudos } = useGetEstudosByTopico();
    const { anotacao, isLoading: isLoadingAnotacao, fetchAnotacao } = useGetAnotacaoByTopico();
    const [notesHtml, setNotesHtml] = useState('');
    const [isNotesOpen, setIsNotesOpen] = useState(false);

    useEffect(() => {
        fetchTopico(topico.id)
            .then(() => fetchEstudos(topico.id)
                .then(() => fetchAnotacao(topico.id)));
    }, [topico.id]);

    useEffect(() => {
        setNotesHtml(anotacao?.conteudo ?? '');
    }, [anotacao]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Estudos', href: '/estudos' },
        { title: 'Disciplinas', href: `/estudos/concursos/${topico.concurso_id ?? ''}` },
        { title: topico.nome, href: `/estudos/topicos/${topico.id}` },
        { title: 'Revisao', href: `/estudos/topicos/${topico.id}/revisao` },
    ];

    const totalSeconds = useMemo(
        () => estudos.reduce((acc, estudo) => acc + estudo.tempo_segundos, 0),
        [estudos],
    );

    const notesCount = notesHtml.trim().length > 0 ? 1 : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Revisao - ${topico.nome}`} />
            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
                <div className="container mx-auto px-4 py-8 max-w-5xl">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => router.visit(`/estudos/topicos/${topico.id}`)}
                                className="bg-white/80"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    <BookOpen className="h-6 w-6 text-violet-600" />
                                    Modo Revisao
                                </h1>
                                <p className="text-slate-500 text-sm">
                                    {topicoDetalhe?.descricao ?? 'Revise suas anotacoes e arquivos'}
                                </p>
                            </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-violet-100 text-violet-700">
                            Revisando
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-2 border-emerald-100 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <NotebookPen className="h-5 w-5 text-emerald-600" />
                                    <CardTitle className="text-lg">Minhas Anotacoes</CardTitle>
                                </div>
                                <span className="text-sm text-slate-500">
                                    {notesCount} {notesCount === 1 ? 'anotacao' : 'anotacoes'}
                                </span>
                            </CardHeader>
                            <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
                                {isLoadingAnotacao ? (
                                    <div className="flex items-center justify-center py-12 text-slate-500">
                                        <Spinner />
                                    </div>
                                ) : notesCount === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                        <NotebookPen className="h-12 w-12 mb-3 opacity-30" />
                                        <p className="text-sm font-medium">Nenhuma anotacao ainda</p>
                                        <p className="text-xs mt-1">Comece a estudar para criar anotacoes</p>
                                    </div>
                                ) : (
                                    <NotesSummaryCard notesHtml={notesHtml} setIsNotesOpen={setIsNotesOpen} />
                                )}
                            </CardContent>
                        </Card>

                        <StudyFilesCard topicoId={topico.id} />
                    </div>

                    <SessionSummaryCard
                        isLoadingEstudos={isLoadingEstudos}
                        totalSeconds={totalSeconds}
                        notesCount={notesCount}
                    />

                    <NotesModal
                        isOpen={isNotesOpen}
                        onOpenChange={setIsNotesOpen}
                        notesHtml={notesHtml}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
