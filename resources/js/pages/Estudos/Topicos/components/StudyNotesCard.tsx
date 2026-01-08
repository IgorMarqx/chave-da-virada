import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { TooltipProvider } from '@/components/ui/tooltip';
import { NotebookPen } from 'lucide-react';
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
import { useUpsertAnotacao } from '@/hooks/Anotacoes/useUpsertAnotacao';
import { cn } from '@/lib/utils';
import { getAuthToken } from '@/lib/http';
import StudyNotesToolbar, { type StudyNotesToolbarState } from './StudyNotesToolbar';
import StudyNotesHeaderActions from './StudyNotesHeaderActions';
import useFloatingNotes from './useFloatingNotes';

type StudyNotesCardProps = {
    notes: string;
    onNotesChange: (value: string) => void;
    topicoId: number;
    isActive: boolean;
    savedAnotacoes: boolean;
    onCloseEdit?: () => void;
};

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
    const [toolbarState, setToolbarState] = useState<StudyNotesToolbarState>({
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

    const {
        isFloatingEnabled,
        isFloatingOpen,
        floatingMode,
        openFloatingNotes,
        toggleFloatingEnabled,
    } = useFloatingNotes({
        topicoId,
        notes,
        autosaveState,
        autosaveAt,
        onNotesChange,
        editor,
    });

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
                            <StudyNotesHeaderActions
                                isSaving={isSaving}
                                isFloatingEnabled={isFloatingEnabled}
                                onOpenFloatingNotes={() => openFloatingNotes()}
                                onToggleFloatingEnabled={toggleFloatingEnabled}
                                onManualSave={handleManualSave}
                                onCloseEdit={onCloseEdit}
                            />
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <StudyNotesToolbar
                            editor={editor}
                            toolbarState={toolbarState}
                            onLink={handleLink}
                        />

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
                {isFloatingOpen && floatingMode ? (
                    <div className="mt-2 text-xs text-emerald-700">
                        {floatingMode === 'pip'
                            ? 'Janela PiP ativa. Voce pode continuar anotando fora da pagina.'
                            : 'Janela flutuante ativa. Voce pode continuar anotando fora da pagina.'}
                    </div>
                ) : null}
                <div className="mt-2">
                    <InputError message={error ?? undefined} />
                </div>
            </div>
        </TooltipProvider>
    );
}
