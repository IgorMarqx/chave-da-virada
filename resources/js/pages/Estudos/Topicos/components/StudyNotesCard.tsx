import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List,
    ListOrdered,
    Quote,
    Code,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Table2,
    Link2,
    Undo2,
    Redo2,
    Highlighter,
    Palette,
    NotebookPen,
    Save,
    Type,
    LayoutList,
    AlignJustify,
    RotateCcw,
    X,
} from 'lucide-react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import UnderlineExtension from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Spinner } from '@/components/ui/spinner';
import { useUpsertAnotacao } from '@/hooks/Anotacoes/useUpsertAnotacao';
import { cn } from '@/lib/utils';
import { getAuthToken } from '@/lib/http';

type StudyNotesCardProps = {
    notes: string;
    onNotesChange: (value: string) => void;
    topicoId: number;
    isActive: boolean;
    savedAnotacoes: boolean;
    onCloseEdit?: () => void;
};

type ToolbarButtonProps = {
    onClick: () => void;
    tooltip: string;
    isActive?: boolean;
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
};

function ToolbarButton({
    onClick,
    tooltip,
    isActive = false,
    disabled = false,
    className,
    children,
}: ToolbarButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    onClick={onClick}
                    disabled={disabled}
                    className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200',
                        'hover:scale-105 active:scale-95',
                        isActive
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                            : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600',
                        disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-slate-400',
                        className
                    )}
                    aria-label={tooltip}
                >
                    {children}
                </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-slate-800 text-xs text-white">
                {tooltip}
            </TooltipContent>
        </Tooltip>
    );
}

function ToolbarDivider() {
    return (
        <div className="mx-1 h-6 w-px bg-gradient-to-b from-transparent via-emerald-200 to-transparent" />
    );
}

function ToolbarGroup({
    label,
    icon: Icon,
    children,
}: {
    label: string;
    icon: React.ElementType;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-0.5">
            <div className="mr-1 flex items-center gap-1 rounded-md bg-emerald-50/50 px-1.5 py-0.5">
                <Icon className="h-3 w-3 text-emerald-600" />
                <span className="text-[10px] font-medium text-emerald-700">{label}</span>
            </div>
            {children}
        </div>
    );
}

export default function StudyNotesCard({
    notes,
    onNotesChange,
    topicoId,
    isActive,
    savedAnotacoes,
    onCloseEdit,
}: StudyNotesCardProps) {
    const { isLoading: isSaving, error, handleSave } = useUpsertAnotacao();
    const [plainLength, setPlainLength] = useState(0);
    const [toolbarState, setToolbarState] = useState({
        bold: false,
        italic: false,
        underline: false,
        strike: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        code: false,
        link: false,
        table: false,
        align: null as 'left' | 'center' | 'right' | null,
        textColor: undefined as string | undefined,
        highlightColor: undefined as string | undefined,
        hasHighlight: false,
    });
    const [autosaveState, setAutosaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [autosaveAt, setAutosaveAt] = useState<string | null>(null);
    const saveTriggerRef = useRef(false);
    const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSavedRef = useRef('');
    const hydratedRef = useRef(false);
    const localDraftRef = useRef<string | null>(null);
    const shouldPreferLocalDraftRef = useRef(false);
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: { keepMarks: true, keepAttributes: false },
                orderedList: { keepMarks: true, keepAttributes: false },
            }),
            UnderlineExtension,
            TextStyle,
            Color.configure({ types: ['textStyle'] }),
            Highlight.configure({ multicolor: true }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { rel: 'noopener noreferrer nofollow' },
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: 'Escreva suas anotacoes aqui...' }),
        ],
        content: notes || '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm prose-slate max-w-none min-h-[280px] p-4 focus:outline-none',
            },
        },
        onUpdate: ({ editor: editorInstance }) => {
            onNotesChange(editorInstance.getHTML());
            setPlainLength(editorInstance.getText().trim().length);
        },
    });

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        if (hydratedRef.current) {
            return;
        }

        const stored = window.localStorage.getItem(`topico-notes-${topicoId}`);
        localDraftRef.current = stored;
        shouldPreferLocalDraftRef.current = Boolean(stored);

        if (stored) {
            onNotesChange(stored);
        }

        hydratedRef.current = true;
    }, [notes, onNotesChange, topicoId]);

    useEffect(() => {
        if (!editor) {
            return;
        }

        const localDraft = localDraftRef.current;
        const shouldPreferLocalDraft = shouldPreferLocalDraftRef.current;

        if (shouldPreferLocalDraft && localDraft && notes !== localDraft) {
            return;
        }

        if (notes !== editor.getHTML()) {
            editor.commands.setContent(notes || '', { emitUpdate: false });
        }
    }, [editor, notes]);

    const syncToolbarState = useCallback(() => {
        if (!editor) {
            return;
        }

        const align: 'left' | 'center' | 'right' | null =
            editor.isActive({ textAlign: 'left' })
                ? 'left'
                : editor.isActive({ textAlign: 'center' })
                    ? 'center'
                    : editor.isActive({ textAlign: 'right' })
                        ? 'right'
                        : null;

        const textColor = editor.getAttributes('textStyle').color as
            | string
            | undefined;
        const highlightColor = editor.getAttributes('highlight').color as
            | string
            | undefined;
        const hasHighlight = editor.isActive('highlight');

        setToolbarState({
            bold: editor.isActive('bold'),
            italic: editor.isActive('italic'),
            underline: editor.isActive('underline'),
            strike: editor.isActive('strike'),
            bulletList: editor.isActive('bulletList'),
            orderedList: editor.isActive('orderedList'),
            blockquote: editor.isActive('blockquote'),
            code: editor.isActive('code'),
            link: editor.isActive('link'),
            table: editor.isActive('table'),
            align,
            textColor,
            highlightColor,
            hasHighlight,
        });
    }, [editor]);

    useEffect(() => {
        if (!editor) {
            return;
        }

        syncToolbarState();

        editor.on('selectionUpdate', syncToolbarState);
        editor.on('transaction', syncToolbarState);
        editor.on('focus', syncToolbarState);
        editor.on('blur', syncToolbarState);

        return () => {
            editor.off('selectionUpdate', syncToolbarState);
            editor.off('transaction', syncToolbarState);
            editor.off('focus', syncToolbarState);
            editor.off('blur', syncToolbarState);
        };
    }, [editor, syncToolbarState]);

    useEffect(() => {
        if (!editor) {
            setPlainLength(notes.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().length);
            return;
        }
        setPlainLength(editor.getText().trim().length);
    }, [editor, notes]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        window.localStorage.setItem(`topico-notes-${topicoId}`, notes);
        localDraftRef.current = notes;
        if (notes.trim()) {
            shouldPreferLocalDraftRef.current = true;
        }

        if (!notes.trim()) {
            return;
        }

        if (autosaveTimeoutRef.current) {
            clearTimeout(autosaveTimeoutRef.current);
        }

        autosaveTimeoutRef.current = setTimeout(async () => {
            if (notes === lastSavedRef.current) {
                return;
            }

            setAutosaveState('saving');
            const saved = await handleSave(
                { topico_id: topicoId, conteudo: notes },
                { silent: true }
            );

            if (saved) {
                lastSavedRef.current = notes;
                setAutosaveState('saved');
                setAutosaveAt(new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                }));
                window.localStorage.removeItem(`topico-notes-${topicoId}`);
                localDraftRef.current = null;
                shouldPreferLocalDraftRef.current = false;
            } else {
                setAutosaveState('idle');
            }
        }, 1200);

        return () => {
            if (autosaveTimeoutRef.current) {
                clearTimeout(autosaveTimeoutRef.current);
            }
        };
    }, [handleSave, notes, topicoId]);

    const handleManualSave = async () => {
        const saved = await handleSave({ topico_id: topicoId, conteudo: notes });
        if (saved) {
            lastSavedRef.current = notes;
            setAutosaveState('saved');
            setAutosaveAt(new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
            }));
            window.localStorage.removeItem(`topico-notes-${topicoId}`);
            localDraftRef.current = null;
            shouldPreferLocalDraftRef.current = false;
        }
    };

    const flushAutosave = useCallback(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const currentNotes = notes.trim();
        if (!currentNotes || currentNotes === lastSavedRef.current) {
            return;
        }

        const token = getAuthToken();

        void window.fetch('/api/anotacoes', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ topico_id: topicoId, conteudo: notes }),
            keepalive: true,
        });
    }, [notes, topicoId]);

    const handleLink = () => {
        if (!editor) {
            return;
        }
        const previousUrl = editor.getAttributes('link').href as string | undefined;
        const url = window.prompt('URL do link', previousUrl || '');
        if (url === null) {
            return;
        }
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    useEffect(() => {
        if (!savedAnotacoes) {
            saveTriggerRef.current = false;
            return;
        }

        if (saveTriggerRef.current || isSaving) {
            return;
        }

        saveTriggerRef.current = true;
        handleSave({ topico_id: topicoId, conteudo: notes }, { silent: true });
    }, [savedAnotacoes, isSaving, handleSave, notes, topicoId]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const handlePageHide = () => flushAutosave();
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                flushAutosave();
            }
        };

        window.addEventListener('pagehide', handlePageHide);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('pagehide', handlePageHide);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [flushAutosave]);

    const activeTextColor = toolbarState.textColor;
    const activeHighlightColor = toolbarState.highlightColor;
    const hasTextColor = Boolean(activeTextColor);
    const hasHighlight = toolbarState.hasHighlight;

    return (
        <TooltipProvider delayDuration={300}>
            <div
                className={cn(
                    'transition-all duration-500 ease-out',
                    isActive
                        ? 'mb-8 max-h-[700px] translate-y-0 opacity-100'
                        : 'mb-0 max-h-0 -translate-y-4 overflow-hidden opacity-0'
                )}
            >
                <Card className="overflow-hidden border-0 bg-gradient-to-br from-white to-emerald-50/30 py-0 shadow-xl shadow-emerald-500/5">
                    <CardHeader className="border-b border-emerald-100/50 bg-gradient-to-r from-emerald-500 to-teal-500 pb-4 pt-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                    <NotebookPen className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-white">
                                        Anotacoes
                                    </CardTitle>
                                    <p className="text-xs text-emerald-100">
                                        {plainLength} caracteres
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {onCloseEdit ? (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={onCloseEdit}
                                        className="h-9 w-9 rounded-xl bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                                        aria-label="Fechar edicao"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                ) : null}
                                <button
                                    type="button"
                                    onClick={handleManualSave}
                                    disabled={isSaving}
                                    className={cn(
                                        'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200',
                                        'bg-white/20 text-white backdrop-blur-sm',
                                        'hover:scale-105 hover:bg-white/30 active:scale-95',
                                        'disabled:cursor-not-allowed disabled:opacity-50'
                                    )}
                                >
                                    {isSaving ? (
                                        <>
                                            <Spinner className="h-4 w-4 text-white" />
                                            <span>Salvando...</span>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2 cursor-pointer">
                                            <Save className="h-4 w-4" />
                                            <span>Salvar</span>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="flex flex-wrap items-center gap-3 border-b border-emerald-100/50 bg-white/80 px-4 py-3 backdrop-blur-sm">
                            <ToolbarGroup label="Texto" icon={Type}>
                                <ToolbarButton
                                    onClick={() => editor?.chain().focus().toggleBold().run()}
                                    isActive={toolbarState.bold}
                                    tooltip="Negrito (Ctrl+B)"
                                >
                                    <Bold className="h-4 w-4" />
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                                    isActive={toolbarState.italic}
                                    tooltip="Italico (Ctrl+I)"
                                >
                                    <Italic className="h-4 w-4" />
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => editor?.chain().focus().toggleUnderline().run()}
                                    isActive={toolbarState.underline}
                                    tooltip="Sublinhado (Ctrl+U)"
                                >
                                    <Underline className="h-4 w-4" />
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                                    isActive={toolbarState.strike}
                                    tooltip="Riscado"
                                >
                                    <Strikethrough className="h-4 w-4" />
                                </ToolbarButton>
                            </ToolbarGroup>

                            <ToolbarDivider />

                            <div className="flex items-center gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={cn(
                                                'flex items-center gap-1.5 rounded-lg border bg-white px-2 py-1 shadow-sm transition',
                                                hasTextColor
                                                    ? 'border-emerald-300 ring-1 ring-emerald-200'
                                                    : 'border-emerald-100'
                                            )}
                                        >
                                            <Palette className="h-3.5 w-3.5 text-emerald-600" />
                                            <input
                                                type="color"
                                                value={activeTextColor ?? '#0f172a'}
                                                onChange={(event) =>
                                                    editor
                                                        ?.chain()
                                                        .focus()
                                                        .setColor(event.target.value)
                                                        .run()
                                                }
                                                className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent p-0"
                                                aria-label="Cor do texto"
                                            />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="bg-slate-800 text-xs text-white">
                                        Cor do texto
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={cn(
                                                'flex items-center gap-1.5 rounded-lg border bg-white px-2 py-1 shadow-sm transition',
                                                hasHighlight
                                                    ? 'border-emerald-300 ring-1 ring-emerald-200'
                                                    : 'border-emerald-100'
                                            )}
                                        >
                                            <Highlighter className="h-3.5 w-3.5 text-amber-500" />
                                            <input
                                                type="color"
                                                value={activeHighlightColor ?? '#fef08a'}
                                                onChange={(event) =>
                                                    editor
                                                        ?.chain()
                                                        .focus()
                                                        .setHighlight({
                                                            color: event.target.value,
                                                        })
                                                        .run()
                                                }
                                                className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent p-0"
                                                aria-label="Cor do destaque"
                                            />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="bg-slate-800 text-xs text-white">
                                        Destacar texto
                                    </TooltipContent>
                                </Tooltip>
                            </div>

                            <ToolbarDivider />

                            <ToolbarGroup label="Listas" icon={LayoutList}>
                                <ToolbarButton
                                    onClick={() =>
                                        editor?.chain().focus().toggleBulletList().run()
                                    }
                                    isActive={toolbarState.bulletList}
                                    tooltip="Lista com marcadores"
                                >
                                    <List className="h-4 w-4" />
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() =>
                                        editor?.chain().focus().toggleOrderedList().run()
                                    }
                                    isActive={toolbarState.orderedList}
                                    tooltip="Lista numerada"
                                >
                                    <ListOrdered className="h-4 w-4" />
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() =>
                                        editor?.chain().focus().toggleBlockquote().run()
                                    }
                                    isActive={toolbarState.blockquote}
                                    tooltip="Citacao"
                                >
                                    <Quote className="h-4 w-4" />
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => editor?.chain().focus().toggleCode().run()}
                                    isActive={toolbarState.code}
                                    tooltip="Codigo"
                                >
                                    <Code className="h-4 w-4" />
                                </ToolbarButton>
                            </ToolbarGroup>

                            <ToolbarDivider />

                            <ToolbarGroup label="Alinhar" icon={AlignJustify}>
                                <ToolbarButton
                                    onClick={() =>
                                        editor?.chain().focus().setTextAlign('left').run()
                                    }
                                    isActive={toolbarState.align === 'left'}
                                    tooltip="Alinhar a esquerda"
                                >
                                    <AlignLeft className="h-4 w-4" />
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() =>
                                        editor?.chain().focus().setTextAlign('center').run()
                                    }
                                    isActive={toolbarState.align === 'center'}
                                    tooltip="Centralizar"
                                >
                                    <AlignCenter className="h-4 w-4" />
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() =>
                                        editor?.chain().focus().setTextAlign('right').run()
                                    }
                                    isActive={toolbarState.align === 'right'}
                                    tooltip="Alinhar a direita"
                                >
                                    <AlignRight className="h-4 w-4" />
                                </ToolbarButton>
                            </ToolbarGroup>

                            <ToolbarDivider />

                            <ToolbarButton
                                onClick={handleLink}
                                isActive={toolbarState.link}
                                tooltip="Inserir link"
                            >
                                <Link2 className="h-4 w-4" />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                                        .run()
                                }
                                isActive={toolbarState.table}
                                tooltip="Inserir tabela"
                            >
                                <Table2 className="h-4 w-4" />
                            </ToolbarButton>

                            <ToolbarDivider />

                            <ToolbarGroup label="Historico" icon={RotateCcw}>
                                <ToolbarButton
                                    onClick={() => editor?.chain().focus().undo().run()}
                                    disabled={!editor?.can().undo()}
                                    tooltip="Desfazer (Ctrl+Z)"
                                >
                                    <Undo2 className="h-4 w-4" />
                                </ToolbarButton>
                                <ToolbarButton
                                    onClick={() => editor?.chain().focus().redo().run()}
                                    disabled={!editor?.can().redo()}
                                    tooltip="Refazer (Ctrl+Y)"
                                >
                                    <Redo2 className="h-4 w-4" />
                                </ToolbarButton>
                            </ToolbarGroup>
                        </div>

                        <div className="relative">
                            <div className="max-h-[350px] overflow-y-auto bg-white">
                                <EditorContent editor={editor} />
                            </div>
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent" />
                        </div>

                        <div className="flex items-center justify-between border-t border-emerald-100/50 bg-emerald-50/30 px-4 py-2">
                            <p className="text-xs text-slate-500">
                                💡 Use{' '}
                                <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-medium shadow-sm">
                                    Ctrl+B
                                </kbd>{' '}
                                para negrito,{' '}
                                <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-medium shadow-sm">
                                    Ctrl+I
                                </kbd>{' '}
                                para italico
                            </p>
                            <div className="flex items-center gap-2 text-xs text-emerald-600">
                                <span
                                    className={cn(
                                        'h-2 w-2 rounded-full',
                                        autosaveState === 'saving'
                                            ? 'animate-pulse bg-amber-400'
                                            : 'bg-emerald-400'
                                    )}
                                />
                                <span>
                                    {autosaveState === 'saving'
                                        ? 'Salvando automaticamente...'
                                        : autosaveAt
                                            ? `Salvo automaticamente ${autosaveAt}`
                                            : 'Salvo automaticamente'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="mt-2">
                    <InputError message={error ?? undefined} />
                </div>
            </div>
        </TooltipProvider>
    );
}
