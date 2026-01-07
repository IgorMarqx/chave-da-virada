import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
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
    NotebookPen,
} from 'lucide-react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import UnderlineExtension from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Spinner } from '@/components/ui/spinner';
import { useUpsertAnotacao } from '@/hooks/Anotacoes/useUpsertAnotacao';

type StudyNotesCardProps = {
    notes: string;
    onNotesChange: (value: string) => void;
    topicoId: number;
    isActive: boolean;
    savedAnotacoes: boolean;
};

export default function StudyNotesCard({
    notes,
    onNotesChange,
    topicoId,
    isActive,
    savedAnotacoes,
}: StudyNotesCardProps) {
    const { isLoading: isSaving, error, handleSave } = useUpsertAnotacao();
    const [plainLength, setPlainLength] = useState(0);
    const saveTriggerRef = useRef(false);
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: { keepMarks: true, keepAttributes: false },
                orderedList: { keepMarks: true, keepAttributes: false },
            }),
            UnderlineExtension,
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
                class:
                    'min-h-[240px] rounded-md border border-emerald-200 bg-white/50 p-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none',
            },
        },
        onUpdate: ({ editor: editorInstance }) => {
            onNotesChange(editorInstance.getHTML());
            setPlainLength(editorInstance.getText().trim().length);
        },
    });

    useEffect(() => {
        if (!editor) {
            return;
        }
        if (notes !== editor.getHTML()) {
            editor.commands.setContent(notes || '', { emitUpdate: false });
        }
    }, [editor, notes]);

    useEffect(() => {
        if (!editor) {
            setPlainLength(notes.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().length);
            return;
        }
        setPlainLength(editor.getText().trim().length);
    }, [editor, notes]);

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
        handleSave({ topico_id: topicoId, conteudo: notes });
    }, [savedAnotacoes, isSaving, handleSave, notes, topicoId]);

    return (
        <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${isActive ? 'mb-8 max-h-[600px] opacity-100' : 'mb-0 max-h-0 opacity-0'
                }`}
        >
            <Card className="border-2 border-emerald-100 bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-2 pb-4">
                    <NotebookPen className="h-5 w-5 text-emerald-600" />
                    <CardTitle className="text-lg">Anotacoes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center">
                        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-emerald-100 bg-white/70 p-2 text-xs">

                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleBold().run()}
                                className={`rounded-md p-2 transition ${editor?.isActive('bold') ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-emerald-50'}`}
                                aria-label="Negrito"
                            >
                                <Bold className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleItalic().run()}
                                className={`rounded-md p-2 transition ${editor?.isActive('italic') ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-emerald-50'}`}
                                aria-label="Italico"
                            >
                                <Italic className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                                className={`rounded-md p-2 transition ${editor?.isActive('underline') ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-emerald-50'}`}
                                aria-label="Sublinhado"
                            >
                                <Underline className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleStrike().run()}
                                className={`rounded-md p-2 transition ${editor?.isActive('strike') ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-emerald-50'}`}
                                aria-label="Riscado"
                            >
                                <Strikethrough className="h-4 w-4" />
                            </button>
                            <span className="h-6 w-px bg-emerald-100" />
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                className={`rounded-md p-2 transition ${editor?.isActive('bulletList') ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-emerald-50'}`}
                                aria-label="Lista"
                            >
                                <List className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                className={`rounded-md p-2 transition ${editor?.isActive('orderedList') ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-emerald-50'}`}
                                aria-label="Lista numerada"
                            >
                                <ListOrdered className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                                className={`rounded-md p-2 transition ${editor?.isActive('blockquote') ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-emerald-50'}`}
                                aria-label="Citação"
                            >
                                <Quote className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleCode().run()}
                                className={`rounded-md p-2 transition ${editor?.isActive('code') ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-emerald-50'}`}
                                aria-label="Codigo"
                            >
                                <Code className="h-4 w-4" />
                            </button>
                            <span className="h-6 w-px bg-emerald-100" />
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                                className={`rounded-md p-2 transition ${editor?.isActive({ textAlign: 'left' }) ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-emerald-50'}`}
                                aria-label="Alinhar esquerda"
                            >
                                <AlignLeft className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                                className={`rounded-md p-2 transition ${editor?.isActive({ textAlign: 'center' }) ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-emerald-50'}`}
                                aria-label="Alinhar centro"
                            >
                                <AlignCenter className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                                className={`rounded-md p-2 transition ${editor?.isActive({ textAlign: 'right' }) ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-emerald-50'}`}
                                aria-label="Alinhar direita"
                            >
                                <AlignRight className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleLink}
                                className={`rounded-md p-2 transition ${editor?.isActive('link') ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-emerald-50'}`}
                                aria-label="Link"
                            >
                                <Link2 className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                                className="rounded-md p-2 text-slate-600 transition hover:bg-emerald-50"
                                aria-label="Tabela"
                            >
                                <Table2 className="h-4 w-4" />
                            </button>
                            <span className="h-6 w-px bg-emerald-100" />
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().undo().run()}
                                className="rounded-md p-2 text-slate-600 transition hover:bg-emerald-50"
                                aria-label="Desfazer"
                            >
                                <Undo2 className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().redo().run()}
                                className="rounded-md p-2 text-slate-600 transition hover:bg-emerald-50"
                                aria-label="Refazer"
                            >
                                <Redo2 className="h-4 w-4" />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => handleSave({ topico_id: topicoId, conteudo: notes })}
                            disabled={isSaving}
                            className="rounded-md p-2 text-white transition hover:bg-emerald-500 bg-emerald-400 cursor-pointer text-sm disabled:cursor-not-allowed disabled:opacity-70"
                            aria-label="Salvar anotacoes"
                        >
                            {isSaving ? <Spinner /> : 'Salvar Anotacoes'}
                        </button>
                    </div>
                    <div className="max-h-[360px] overflow-y-auto rounded-md border border-emerald-200 bg-white/50">
                        <EditorContent editor={editor} />
                    </div>
                    <p className="mt-2 text-right text-xs text-slate-500">{plainLength} caracteres</p>
                    <div className="mt-2">
                        <InputError message={error ?? undefined} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
