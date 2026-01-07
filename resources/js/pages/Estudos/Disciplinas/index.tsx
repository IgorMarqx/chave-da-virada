import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type DragEvent, type TouchEvent, useEffect, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { useGetTopicosByDisciplina, type Topico } from '@/hooks/Topicos/useGetTopicosByDisciplina';
import { useUpdateTopicosOrder } from '@/hooks/Topicos/useUpdateTopicosOrder';
import CreateTopico from './components/CreateTopico';
import EditTopico from './components/EditTopico';
import DeleteTopicoDialog from './components/DeleteTopicoDialog';
import TopicoCard from './components/TopicoCard';
import TopicosDragInstruction from './components/TopicosDragInstruction';
import TopicosEmptyStateCard from './components/TopicosEmptyStateCard';
import TopicosHeader from './components/TopicosHeader';
import TopicosLoadingCard from './components/TopicosLoadingCard';

type Disciplina = {
    id: number;
    nome: string;
    concurso_id: number;
};

type PageProps = {
    disciplina: Disciplina;
};

export default function DisciplinaTopicos({ disciplina }: PageProps) {
    const { topicos, isLoading, error, fetchTopicos } = useGetTopicosByDisciplina();
    const { updateTopicosOrder, isSaving, error: orderError } = useUpdateTopicosOrder();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [orderedTopicos, setOrderedTopicos] = useState<Topico[]>([]);
    const [draggedId, setDraggedId] = useState<number | null>(null);
    const [dragOverId, setDragOverId] = useState<number | null>(null);
    const [orderSaved, setOrderSaved] = useState(false);
    const draggedRef = useRef<number | null>(null);
    const orderSavedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [editingTopico, setEditingTopico] = useState<{
        id: number;
        nome: string;
        descricao?: string | null;
    } | null>(null);
    const [deletingTopico, setDeletingTopico] = useState<{
        id: number;
        nome: string;
    } | null>(null);

    useEffect(() => {
        fetchTopicos(disciplina.id);
    }, [disciplina.id, fetchTopicos]);

    useEffect(() => {
        setOrderedTopicos(topicos);
    }, [topicos]);

    useEffect(() => {
        return () => {
            if (orderSavedTimeoutRef.current) {
                clearTimeout(orderSavedTimeoutRef.current);
            }
        };
    }, []);

    const handleEdit = (topico: { id: number; nome: string; descricao?: string | null }) => {
        setEditingTopico(topico);
        setIsEditOpen(true);
    };

    const handleDelete = (topico: { id: number; nome: string }) => {
        setDeletingTopico(topico);
        setIsDeleteOpen(true);
    };

    const reorderTopicos = (items: Topico[], sourceId: number, targetId: number) => {
        const sourceIndex = items.findIndex((topico) => topico.id === sourceId);
        const targetIndex = items.findIndex((topico) => topico.id === targetId);

        if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
            return items;
        }

        const next = [...items];
        const [moved] = next.splice(sourceIndex, 1);
        next.splice(targetIndex, 0, moved);

        return next;
    };

    const applyReorder = async (sourceId: number, targetId: number) => {
        const previousOrder = orderedTopicos;
        const nextOrder = reorderTopicos(orderedTopicos, sourceId, targetId);

        if (nextOrder === orderedTopicos) {
            return;
        }

        setOrderedTopicos(nextOrder);

        const updated = await updateTopicosOrder(
            disciplina.id,
            nextOrder.map((topico) => topico.id)
        );

        if (!updated) {
            setOrderedTopicos(previousOrder);
            return;
        }

        setOrderedTopicos(updated);
        setOrderSaved(true);

        if (orderSavedTimeoutRef.current) {
            clearTimeout(orderSavedTimeoutRef.current);
        }

        orderSavedTimeoutRef.current = setTimeout(() => {
            setOrderSaved(false);
        }, 2000);
    };

    const handleDragStart = (event: DragEvent, id: number) => {
        setDraggedId(id);
        draggedRef.current = id;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(id));
    };

    const handleDragOver = (event: DragEvent, id: number) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';

        if (draggedRef.current !== id) {
            setDragOverId(id);
        }
    };

    const handleDragLeave = () => {
        setDragOverId(null);
    };

    const handleDrop = async (event: DragEvent, targetId: number) => {
        event.preventDefault();
        const sourceId = draggedRef.current;

        if (sourceId === null || sourceId === targetId) {
            setDraggedId(null);
            setDragOverId(null);
            draggedRef.current = null;
            return;
        }

        await applyReorder(sourceId, targetId);

        setDraggedId(null);
        setDragOverId(null);
        draggedRef.current = null;
    };

    const handleDragEnd = () => {
        setDraggedId(null);
        setDragOverId(null);
        draggedRef.current = null;
    };

    const handleTouchStart = (event: TouchEvent, id: number) => {
        event.preventDefault();
        setDraggedId(id);
        draggedRef.current = id;
        setDragOverId(null);
    };

    const handleTouchMove = (event: TouchEvent) => {
        event.preventDefault();
        const touch = event.touches[0];

        if (!touch) {
            return;
        }

        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const card = element?.closest<HTMLElement>('[data-topico-id]');
        const nextId = card ? Number(card.dataset.topicoId) : null;

        if (nextId && draggedRef.current !== nextId) {
            setDragOverId(nextId);
        }
    };

    const handleTouchEnd = async () => {
        const sourceId = draggedRef.current;
        const targetId = dragOverId;

        if (sourceId && targetId && sourceId !== targetId) {
            await applyReorder(sourceId, targetId);
        }

        setDraggedId(null);
        setDragOverId(null);
        draggedRef.current = null;
    };

    const formatDateTime = (value?: string | null) => {
        if (!value) {
            return '';
        }

        return new Date(value).toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Estudos', href: '/estudos' },
        { title: 'Disciplinas', href: `/estudos/concursos/${disciplina.concurso_id}` },
        { title: disciplina.nome, href: `/estudos/disciplinas/${disciplina.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Topicos - ${disciplina.nome}`} />

            <div className="min-h-full bg-gradient-to-br from-slate-50 via-rose-50/30 to-orange-50/20">
                <div className="mx-auto flex w-full max-w-8xl flex-1 flex-col gap-6 px-2 py-8 sm:px-6 lg:px-8">
                    <TopicosHeader
                        disciplinaNome={disciplina.nome}
                        totalTopicos={orderedTopicos.length}
                        backHref={`/estudos/concursos/${disciplina.concurso_id}`}
                        onCreate={() => setIsCreateOpen(true)}
                    />

                    <InputError message={error ?? undefined} />
                    <InputError message={orderError ?? undefined} />
                    <CreateTopico
                        disciplinaId={disciplina.id}
                        open={isCreateOpen}
                        onOpenChange={setIsCreateOpen}
                        onSuccess={() => fetchTopicos(disciplina.id)}
                    />
                    <EditTopico
                        topico={editingTopico}
                        open={isEditOpen}
                        onOpenChange={setIsEditOpen}
                        onSuccess={() => fetchTopicos(disciplina.id)}
                    />
                    <DeleteTopicoDialog
                        topico={deletingTopico}
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                        onSuccess={() => {
                            setDeletingTopico(null);
                            fetchTopicos(disciplina.id);
                        }}
                    />

                    {!isLoading && orderedTopicos.length > 1 ? (
                        <TopicosDragInstruction isSaving={isSaving} orderSaved={orderSaved} />
                    ) : null}

                    {isLoading ? (
                        <TopicosLoadingCard />
                    ) : orderedTopicos.length === 0 ? (
                        <TopicosEmptyStateCard onCreate={() => setIsCreateOpen(true)} />
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {orderedTopicos.map((topico, index) => (
                                <TopicoCard
                                    key={topico.id}
                                    topico={topico}
                                    index={index}
                                    draggedId={draggedId}
                                    dragOverId={dragOverId}
                                    isSaving={isSaving}
                                    formatDateTime={formatDateTime}
                                    onDragStart={handleDragStart}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onDragEnd={handleDragEnd}
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                    onEdit={handleEdit}
                                    onDelete={(item) => handleDelete({ id: item.id, nome: item.nome })}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
