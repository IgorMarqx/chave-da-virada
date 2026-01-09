import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Download,
    Eye,
    FileImage,
    FileText,
    FileType,
    Trash2,
    Upload,
} from 'lucide-react';
import { useArquivosByTopico } from '@/hooks/Arquivos/useArquivosByTopico';
import { useUploadArquivo } from '@/hooks/Arquivos/useUploadArquivo';
import { useDeleteArquivo } from '@/hooks/Arquivos/useDeleteArquivo';
import StudyFilesPreviewModal, { type AttachedFile } from './StudyFilesPreviewModal';
import StudyFilesDeleteModal from './StudyFilesDeleteModal';
import { Spinner } from '@/components/ui/spinner';
import { useIsMobile } from '@/hooks/use-mobile';
import StudyFilesProcessedModal from './StudyFilesProcessedModal';
import { getEcho } from '@/lib/echo';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

type StudyFilesCardProps = {
    topicoId: number;
};

const formatBytes = (value?: number | null) => {
    if (!value || value <= 0) {
        return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(units.length - 1, Math.floor(Math.log(value) / Math.log(1024)));
    const size = value / Math.pow(1024, index);

    return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
};

const getFileIcon = (type: AttachedFile['type']) => {
    if (type === 'image') {
        return <FileImage className="h-6 w-6 text-emerald-500" />;
    }
    if (type === 'doc') {
        return <FileType className="h-6 w-6 text-blue-500" />;
    }
    return <FileText className="h-6 w-6 text-red-500" />;
};

const getFileColor = (type: AttachedFile['type']) => {
    if (type === 'image') {
        return 'border-emerald-100 bg-emerald-50/40';
    }
    if (type === 'doc') {
        return 'border-blue-100 bg-blue-50/40';
    }
    return 'border-red-100 bg-red-50/40';
};

export default function StudyFilesCard({ topicoId }: StudyFilesCardProps) {
    const { props } = usePage<SharedData>();
    const isMobile = useIsMobile();
    const pdfInputRef = useRef<HTMLInputElement | null>(null);
    const docInputRef = useRef<HTMLInputElement | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    const { arquivos, isLoading, error, fetchArquivos, addArquivo, removeArquivo } = useArquivosByTopico();
    const { uploadArquivo, isUploading, isLoading: isUploadingLoading } = useUploadArquivo();
    const { deleteArquivo, isDeleting } = useDeleteArquivo();

    const [selectedFile, setSelectedFile] = useState<AttachedFile | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<AttachedFile | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isProcessedOpen, setIsProcessedOpen] = useState(false);

    useEffect(() => {
        fetchArquivos(topicoId);
    }, [fetchArquivos, topicoId]);

    useEffect(() => {
        let mounted = true;
        let cleanup: (() => void) | null = null;

        const setup = async () => {
            if (!props.auth?.user?.id) {
                return;
            }

            const echo = await getEcho();
            if (!mounted || !echo) {
                if (!echo) {
                    console.warn('[arquivos] echo nao inicializado');
                }
                return;
            }

            const userId = props.auth.user.id;
            const channel = echo.private(`arquivos.${userId}`);
            const handler = (event: { topico_id?: number | null }) => {
                console.info('[arquivos] evento recebido', event);
                if (event?.topico_id !== topicoId) {
                    return;
                }

                fetchArquivos(topicoId);
                setIsProcessedOpen(true);
            };

            console.info('[arquivos] ouvindo canal', `arquivos.${userId}`);
            channel.listen('.arquivo.processado', handler);

            cleanup = () => {
                console.info('[arquivos] saindo do canal', `arquivos.${userId}`);
                channel.stopListening('.arquivo.processado', handler);
                echo.leave(`arquivos.${userId}`);
            };
        };

        void setup();

        return () => {
            mounted = false;
            if (cleanup) {
                cleanup();
            }
        };
    }, [fetchArquivos, props.auth?.user?.id, topicoId]);

    const attachedFiles = useMemo(
        () =>
            arquivos.map((arquivo) => ({
                id: arquivo.id,
                name: arquivo.nome_original,
                type: arquivo.tipo,
                url: arquivo.path,
                sizeLabel: formatBytes(arquivo.tamanho_bytes),
                preview: arquivo.tipo === 'image' ? arquivo.path : null,
            })),
        [arquivos],
    );

    const handleFileUpload = async (
        event: ChangeEvent<HTMLInputElement>,
        tipo: 'pdf' | 'doc' | 'image',
    ) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const uploaded = await uploadArquivo({ topicoId, tipo, file });
        if (uploaded?.arquivo) {
            addArquivo(uploaded.arquivo);
        }

        event.target.value = '';
    };

    const openFilePreview = (file: AttachedFile) => {
        setSelectedFile(file);
        setIsPreviewOpen(true);
    };

    const requestDeleteFile = (file: AttachedFile) => {
        setDeleteTarget(file);
        setIsDeleteOpen(true);
    };

    const handleRemoveFile = async () => {
        if (!deleteTarget) {
            return;
        }

        const success = await deleteArquivo(deleteTarget.id);
        if (success) {
            removeArquivo(deleteTarget.id);
            setIsDeleteOpen(false);
            setDeleteTarget(null);
        }
    };

    return (
        <Card className="border-2 border-sky-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-sky-600" />
                    <CardTitle className="text-lg">Arquivos Anexados</CardTitle>
                </div>
                <span className="text-sm text-muted-foreground">
                    {attachedFiles.length} {attachedFiles.length === 1 ? 'arquivo' : 'arquivos'}
                </span>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col">
                <div className="grid grid-cols-3 gap-2">
                    <input
                        ref={pdfInputRef}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(event) => handleFileUpload(event, 'pdf')}
                    />
                    <input
                        ref={docInputRef}
                        type="file"
                        accept=".doc,.docx"
                        className="hidden"
                        onChange={(event) => handleFileUpload(event, 'doc')}
                    />
                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handleFileUpload(event, 'image')}
                    />

                    <Button
                        variant="outline"
                        size="sm"
                        className="border-dashed border-2 border-red-200 hover:border-red-400 hover:bg-red-50 transition-colors bg-transparent flex flex-col h-auto py-3 cursor-pointer"
                        onClick={() => pdfInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        {isUploadingLoading ? <Spinner className="h-5 w-5 text-red-500 mb-1" /> : <FileText className="h-5 w-5 text-red-500 mb-1" />}
                        <span className="text-xs">PDF</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="border-dashed border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-colors bg-transparent flex flex-col h-auto py-3 cursor-pointer"
                        onClick={() => docInputRef.current?.click()}
                        disabled={isUploading || isUploadingLoading}
                    >
                        {isUploadingLoading ? <Spinner className="h-5 w-5 text-blue-500 mb-1" /> : <FileType className="h-5 w-5 text-blue-500 mb-1" />}
                        <span className="text-xs">DOC</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="border-dashed border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 transition-colors bg-transparent flex flex-col h-auto py-3 cursor-pointer"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isUploading || isUploadingLoading}>
                        {isUploadingLoading ? <Spinner className="h-5 w-5 text-emerald-500 mb-1" /> : <FileImage className="h-5 w-5 text-emerald-500 mb-1" />}
                        <span className="text-xs">Imagem</span>
                    </Button>
                </div>

                <div className="flex-1 min-h-0 max-h-[190px] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Upload className="h-12 w-12 mb-3 opacity-30" />
                            <p className="text-sm font-medium">Carregando arquivos...</p>
                        </div>
                    ) : attachedFiles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Upload className="h-12 w-12 mb-3 opacity-30" />
                            <p className="text-sm font-medium">Nenhum arquivo anexado</p>
                            <p className="text-xs mt-1">Selecione PDF, DOC ou Imagem acima</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {attachedFiles.map((file) => (
                                <div
                                    key={file.id}
                                    className={`relative group rounded-xl border-2 overflow-hidden transition-all hover:shadow-md md:cursor-pointer ${getFileColor(file.type)}`}
                                    onClick={() => {
                                        if (!isMobile) {
                                            openFilePreview(file);
                                        }
                                    }}
                                >
                                    <div className="aspect-square flex items-center justify-center bg-white/50">
                                        {file.type === 'image' && file.preview ? (
                                            <img
                                                src={file.preview}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                {getFileIcon(file.type)}
                                                <span className="text-xs uppercase font-medium text-muted-foreground">
                                                    {file.type}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-2 bg-white/80">
                                        <p className="text-xs font-medium truncate text-foreground">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{file.sizeLabel}</p>
                                    </div>

                                    <div className="absolute inset-0 bg-black/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                openFilePreview(file);
                                            }}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                const anchor = document.createElement('a');
                                                anchor.href = file.url;
                                                anchor.download = file.name;
                                                anchor.click();
                                            }}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                requestDeleteFile(file);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {error ? <p className="text-xs text-red-500">{error}</p> : null}
            </CardContent>
            <StudyFilesPreviewModal
                open={isPreviewOpen}
                file={selectedFile}
                onOpenChange={setIsPreviewOpen}
            />
            <StudyFilesDeleteModal
                open={isDeleteOpen}
                fileName={deleteTarget?.name}
                isDeleting={isDeleting}
                onConfirm={handleRemoveFile}
                onOpenChange={setIsDeleteOpen}
            />
            <StudyFilesProcessedModal
                open={isProcessedOpen}
                onOpenChange={setIsProcessedOpen}
            />
        </Card>
    );
}
