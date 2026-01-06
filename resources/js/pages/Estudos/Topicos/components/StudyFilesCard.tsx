import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

type StudyFilesCardProps = {
    onBack: () => void;
};

export default function StudyFilesCard({ onBack }: StudyFilesCardProps) {
    return (
        <Card className="border-sky-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Arquivos</CardTitle>
                <span className="text-slate-500">0</span>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                    <FileText className="mb-2 h-10 w-10 opacity-50" />
                    <p className="text-sm">Nenhum arquivo anexado</p>
                </div>
                <Button variant="outline" className="w-full bg-transparent" onClick={onBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para disciplina
                </Button>
            </CardContent>
        </Card>
    );
}
