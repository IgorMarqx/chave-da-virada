import StudyActionsCard from './StudyActionsCard';
import StudyFilesCard from './StudyFilesCard';
import StudyHistoryCard from './StudyHistoryCard';

type Estudo = {
    id: number;
    tempo_segundos: number;
    data_estudo: string;
};

type StudyOverviewSectionProps = {
    isActiveStudyMode: boolean;
    topicoId: number;
    estudos: Estudo[];
    isLoadingEstudos: boolean;
    errorEstudos?: string | null;
    notesHtml?: string;
    onReview: () => void;
};

export default function StudyOverviewSection({
    isActiveStudyMode,
    topicoId,
    estudos,
    isLoadingEstudos,
    errorEstudos,
    notesHtml,
    onReview,
}: StudyOverviewSectionProps) {
    return (
        <div className={isActiveStudyMode ? 'order-1' : 'order-2'}>
            <div
                className={`mt-2 grid gap-6 transition-all duration-500 ease-in-out ${isActiveStudyMode ? 'md:mx-auto md:max-w-md md:grid-cols-1' : 'md:grid-cols-3'}`}
            >
                <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${isActiveStudyMode ? 'max-h-0 opacity-0 hidden' : 'max-h-[400px] opacity-100'}`}
                >
                    <StudyActionsCard onReview={onReview} />
                </div>

                {!isActiveStudyMode && <StudyFilesCard topicoId={topicoId} />}

                <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${isActiveStudyMode ? 'max-h-0 opacity-0 hidden' : 'max-h-[400px] opacity-100'}`}
                >
                    <StudyHistoryCard
                        estudos={estudos}
                        isLoading={isLoadingEstudos}
                        error={errorEstudos}
                        notesHtml={notesHtml}
                    />
                </div>
            </div>
        </div>
    );
}
