import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ArrowUpDown, Check, GripVertical } from 'lucide-react';

type TopicosDragInstructionProps = {
    isSaving: boolean;
    orderSaved: boolean;
};

export default function TopicosDragInstruction({
    isSaving,
    orderSaved,
}: TopicosDragInstructionProps) {
    return (
        <Card className="border-dashed border-slate-300 bg-slate-50/50 py-0">
            <CardContent className="flex flex-wrap items-center gap-4 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200/80">
                    <ArrowUpDown className="h-5 w-5 text-slate-600" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Organize seus topicos</p>
                    <p className="text-sm text-slate-500">
                        Arraste pelo icone <GripVertical className="inline h-4 w-4 text-slate-400" /> para reordenar os
                        cards na ordem que preferir estudar.
                    </p>
                </div>
                {isSaving ? (
                    <Badge variant="secondary" className="gap-1 bg-amber-100 text-amber-700">
                        <Spinner className="size-3" />
                        Salvando ordem...
                    </Badge>
                ) : null}
                {orderSaved ? (
                    <Badge variant="secondary" className="gap-1 bg-emerald-100 text-emerald-700">
                        <Check className="h-3 w-3" />
                        Ordem salva!
                    </Badge>
                ) : null}
            </CardContent>
        </Card>
    );
}
