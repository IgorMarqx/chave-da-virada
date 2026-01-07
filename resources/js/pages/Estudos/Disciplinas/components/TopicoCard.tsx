import type React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Topico } from '@/hooks/Topicos/useGetTopicosByDisciplina';
import { Link } from '@inertiajs/react';
import { BookOpen, CalendarCheck, Clock, GripVertical, Pencil, Trash2 } from 'lucide-react';

type TopicoCardProps = {
    topico: Topico;
    index: number;
    draggedId: number | null;
    dragOverId: number | null;
    isSaving: boolean;
    formatDateTime: (value?: string | null) => string;
    onDragStart: (event: React.DragEvent, id: number) => void;
    onDragOver: (event: React.DragEvent, id: number) => void;
    onDragLeave: () => void;
    onDrop: (event: React.DragEvent, id: number) => void;
    onDragEnd: () => void;
    onEdit: (topico: Topico) => void;
    onDelete: (topico: Topico) => void;
};

export default function TopicoCard({
    topico,
    index,
    draggedId,
    dragOverId,
    isSaving,
    formatDateTime,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
    onEdit,
    onDelete,
}: TopicoCardProps) {
    return (
        <Card
            onDragOver={(event) => onDragOver(event, topico.id)}
            onDragLeave={onDragLeave}
            onDrop={(event) => onDrop(event, topico.id)}
            className={cn(
                'group relative py-0 transition-all duration-200',
                draggedId === topico.id && 'scale-[1.02] opacity-50 shadow-lg',
                dragOverId === topico.id && draggedId !== topico.id && 'ring-2 ring-red-300 ring-offset-2',
                !draggedId && 'hover:shadow-md'
            )}
        >
            <CardContent className="p-5">
                <div className="flex gap-3">
                    <div
                        draggable={!isSaving}
                        onDragStart={(event) => onDragStart(event, topico.id)}
                        onDragEnd={onDragEnd}
                        className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-colors',
                            'hover:bg-slate-200 hover:text-slate-600',
                            'active:cursor-grabbing active:bg-slate-300',
                            isSaving ? 'cursor-not-allowed opacity-60' : 'cursor-grab'
                        )}
                        aria-label="Arraste para reordenar"
                    >
                        <GripVertical className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-slate-900">{topico.nome}</h3>
                            <Badge variant="outline" className="shrink-0 text-xs">
                                #{index + 1}
                            </Badge>
                        </div>

                        {topico.descricao ? (
                            <p className="mb-3 line-clamp-2 text-sm text-slate-600">{topico.descricao}</p>
                        ) : null}

                        <div className="mb-4 flex flex-wrap gap-2">
                            {topico.ultima_atividade ? (
                                <Badge variant="secondary" className="gap-1 text-xs font-normal">
                                    <Clock className="h-3 w-3" />
                                    Ultima: {formatDateTime(topico.ultima_atividade)}
                                </Badge>
                            ) : null}
                            {topico.proxima_revisao ? (
                                <Badge
                                    variant="secondary"
                                    className="gap-1 bg-emerald-50 text-xs font-normal text-emerald-700"
                                >
                                    <CalendarCheck className="h-3 w-3" />
                                    Revisao: {formatDateTime(topico.proxima_revisao)}
                                </Badge>
                            ) : null}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button asChild size="sm" className="h-8 gap-1.5 text-xs bg-red-500 hover:bg-red-600 cursor-pointer">
                                <Link href={`/estudos/topicos/${topico.id}`}>
                                    <BookOpen className="h-3.5 w-3.5" />
                                    Estudar
                                </Link>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1.5 bg-transparent text-xs cursor-pointer"
                                onClick={() => onEdit(topico)}
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Editar
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1.5 border-red-200 bg-transparent text-xs text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                                onClick={() => onDelete(topico)}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Excluir
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
