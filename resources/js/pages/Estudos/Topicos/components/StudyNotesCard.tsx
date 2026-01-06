import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { NotebookPen } from 'lucide-react';

type StudyNotesCardProps = {
    notes: string;
    onNotesChange: (value: string) => void;
    isActive: boolean;
};

export default function StudyNotesCard({ notes, onNotesChange, isActive }: StudyNotesCardProps) {
    return (
        <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isActive ? 'mb-8 max-h-[600px] opacity-100' : 'mb-0 max-h-0 opacity-0'
            }`}
        >
            <Card className="border-2 border-emerald-100 bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-2 pb-4">
                    <NotebookPen className="h-5 w-5 text-emerald-600" />
                    <CardTitle className="text-lg">Anotacoes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Escreva suas anotacoes aqui..."
                        value={notes}
                        onChange={(event) => onNotesChange(event.target.value)}
                        className="min-h-[240px] resize-none border-emerald-200 bg-white/50 transition-colors focus:border-emerald-400"
                    />
                    <p className="mt-2 text-right text-xs text-slate-500">{notes.length} caracteres</p>
                </CardContent>
            </Card>
        </div>
    );
}
