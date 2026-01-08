import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Highlighter,
    Italic,
    LayoutList,
    Link2,
    List,
    ListOrdered,
    Palette,
    Quote,
    Redo2,
    RotateCcw,
    Strikethrough,
    Table2,
    Type,
    Underline,
    Undo2,
} from 'lucide-react';
import type { Editor } from '@tiptap/react';

export type StudyNotesToolbarState = {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strike: boolean;
    bulletList: boolean;
    orderedList: boolean;
    blockquote: boolean;
    code: boolean;
    link: boolean;
    table: boolean;
    align: 'left' | 'center' | 'right' | null;
    textColor?: string;
    highlightColor?: string;
    hasHighlight: boolean;
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

type StudyNotesToolbarProps = {
    editor: Editor | null;
    toolbarState: StudyNotesToolbarState;
    onLink: () => void;
};

export default function StudyNotesToolbar({
    editor,
    toolbarState,
    onLink,
}: StudyNotesToolbarProps) {
    const activeTextColor = toolbarState.textColor;
    const activeHighlightColor = toolbarState.highlightColor;
    const hasTextColor = Boolean(activeTextColor);
    const hasHighlight = toolbarState.hasHighlight;

    return (
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
                                    editor?.chain().focus().setColor(event.target.value).run()
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
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    isActive={toolbarState.bulletList}
                    tooltip="Lista com marcadores"
                >
                    <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    isActive={toolbarState.orderedList}
                    tooltip="Lista numerada"
                >
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
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
                    onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                    isActive={toolbarState.align === 'left'}
                    tooltip="Alinhar a esquerda"
                >
                    <AlignLeft className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                    isActive={toolbarState.align === 'center'}
                    tooltip="Centralizar"
                >
                    <AlignCenter className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                    isActive={toolbarState.align === 'right'}
                    tooltip="Alinhar a direita"
                >
                    <AlignRight className="h-4 w-4" />
                </ToolbarButton>
            </ToolbarGroup>

            <ToolbarDivider />

            <ToolbarButton onClick={onLink} isActive={toolbarState.link} tooltip="Inserir link">
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
    );
}
