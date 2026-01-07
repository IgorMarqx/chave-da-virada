import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type StudyActionsCardProps = {
    onReview: () => void;
};

export default function StudyActionsCard({ onReview }: StudyActionsCardProps) {
    return (
        <Card className="border-red-100 bg-white/80 backdrop-blur-sm max-h-95 h-95">
            <CardHeader>
                <CardTitle className="text-lg">Acoes de Estudo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button
                    variant="outline"
                    className="w-full justify-center bg-transparent"
                    onClick={onReview}
                >
                    Revisar
                </Button>
            </CardContent>
        </Card>
    );
}
