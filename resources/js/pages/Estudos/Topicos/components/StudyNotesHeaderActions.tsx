import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { PictureInPicture2, Save, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

type StudyNotesHeaderActionsProps = {
    isSaving: boolean;
    isFloatingEnabled: boolean;
    onOpenFloatingNotes: () => void;
    onToggleFloatingEnabled: () => void;
    onManualSave: () => void;
    onCloseEdit?: () => void;
};

export default function StudyNotesHeaderActions({
    isSaving,
    isFloatingEnabled,
    onOpenFloatingNotes,
    onToggleFloatingEnabled,
    onManualSave,
    onCloseEdit,
}: StudyNotesHeaderActionsProps) {
    return (
        <div className="flex items-center gap-2">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onOpenFloatingNotes}
                        className="h-9 w-9 rounded-xl bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                        aria-label="Abrir janela flutuante de anotacoes"
                    >
                        <PictureInPicture2 className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-slate-800 text-xs text-white">
                    Abrir janela flutuante
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={onToggleFloatingEnabled}
                        className={cn(
                            'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200',
                            'bg-white/20 text-white backdrop-blur-sm',
                            'hover:scale-105 hover:bg-white/30 active:scale-95'
                        )}
                        aria-label="Ativar abertura automatica de anotacoes flutuantes"
                    >
                        {isFloatingEnabled ? (
                            <ToggleRight className="h-4 w-4" />
                        ) : (
                            <ToggleLeft className="h-4 w-4" />
                        )}
                        <span>Auto PiP</span>
                    </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-slate-800 text-xs text-white">
                    {isFloatingEnabled
                        ? 'Abrir automaticamente ao sair da aba'
                        : 'Clique para permitir abrir ao sair'}
                </TooltipContent>
            </Tooltip>
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
                onClick={onManualSave}
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
    );
}
