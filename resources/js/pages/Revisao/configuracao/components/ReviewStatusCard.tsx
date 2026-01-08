import { Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type ReviewStatusCardProps = {
    ativo: boolean;
    onToggle: (nextValue: boolean) => void;
};

export default function ReviewStatusCard({ ativo, onToggle }: ReviewStatusCardProps) {
    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Zap className="h-4 w-4 text-amber-500" />
                        Status do sistema
                    </CardTitle>
                    <Badge
                        variant={ativo ? 'default' : 'secondary'}
                        className={ativo ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}
                    >
                        {ativo ? 'Ativo' : 'Desativado'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-3">
                    <Checkbox
                        id="ativo"
                        checked={ativo}
                        onCheckedChange={(checked) => {
                            onToggle(Boolean(checked));
                        }}
                    />
                    <div>
                        <Label htmlFor="ativo" className="text-sm font-medium text-slate-900">
                            Ativar revisoes automaticas
                        </Label>
                        <p className="text-xs text-slate-500">
                            Quando ativado, o sistema gera revisoes automaticamente no dia configurado.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
