import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import {
    ArrowLeft,
    BookOpen,
    Eye,
    Expand,
    FileText,
    NotebookPen,
    Upload,
} from 'lucide-react';
import { useGetTopico } from '@/hooks/Topicos/useGetTopico';
import { useGetEstudosByTopico } from '@/hooks/Estudos/useGetEstudosByTopico';
import { useGetAnotacaoByTopico } from '@/hooks/Anotacoes/useGetAnotacaoByTopico';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

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
        fetchTopico(topico.id);
        fetchEstudos(topico.id);
        fetchAnotacao(topico.id);
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

    const formatDuration = (totalSecondsValue: number) => {
        const safeSeconds = Math.max(0, Math.floor(totalSecondsValue));
        const hours = Math.floor(safeSeconds / 3600);
        const minutes = Math.floor((safeSeconds % 3600) / 60);
        const seconds = safeSeconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

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
                                    <div className="space-y-3">
                                        <div className="flex justify-end">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsNotesOpen(true)}
                                                className="bg-white/80"
                                            >
                                                <Expand className="mr-2 h-4 w-4" />
                                                Expandir
                                            </Button>
                                        </div>
                                        <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100 max-h-80 overflow-y-auto">
                                            <div
                                                className="ProseMirror max-w-none text-sm text-slate-700"
                                                dangerouslySetInnerHTML={{ __html: notesHtml }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-sky-100 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-sky-600" />
                                    <CardTitle className="text-lg">Arquivos Anexados</CardTitle>
                                </div>
                                <span className="text-sm text-slate-500">0 arquivos</span>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button
                                    variant="outline"
                                    className="w-full border-dashed border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50 transition-colors bg-transparent"
                                    onClick={() => { }}
                                >
                                    <Upload className="mr-2 h-4 w-4" /> Anexar Arquivo
                                </Button>

                                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                    <FileText className="h-12 w-12 mb-3 opacity-30" />
                                    <p className="text-sm font-medium">Nenhum arquivo anexado</p>
                                    <p className="text-xs mt-1">Clique acima para adicionar arquivos</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mt-6 border-2 border-amber-100 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Eye className="h-5 w-5 text-amber-600" />
                                Resumo da Sessao
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-amber-50/50 rounded-lg">
                                    <p className="text-2xl font-bold text-amber-700">
                                        {isLoadingEstudos ? '--:--:--' : formatDuration(totalSeconds)}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">Tempo Total</p>
                                </div>
                                <div className="p-4 bg-emerald-50/50 rounded-lg">
                                    <p className="text-2xl font-bold text-emerald-700">{notesCount}</p>
                                    <p className="text-xs text-slate-500 mt-1">Anotacoes</p>
                                </div>
                                <div className="p-4 bg-sky-50/50 rounded-lg">
                                    <p className="text-2xl font-bold text-sky-700">0</p>
                                    <p className="text-xs text-slate-500 mt-1">Arquivos</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
                        <DialogContent className="!w-[95vw] !max-w-[1600px] max-h-[90vh] overflow-hidden flex flex-col">
                            <DialogHeader className="pb-4 border-b">
                                <DialogTitle className="flex items-center gap-2 text-xl">
                                    <NotebookPen className="h-5 w-5 text-emerald-600" />
                                    Anotacoes do Topico
                                </DialogTitle>
                                <DialogDescription>
                                    Visualizacao ampliada das suas anotacoes.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto py-4">
                                <div className="ProseMirror max-w-none rounded-lg border border-emerald-100 bg-emerald-50/50 p-4 text-sm text-slate-700">
                                    <div dangerouslySetInnerHTML={{ __html: notesHtml }} />
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AppLayout>
    );
}
