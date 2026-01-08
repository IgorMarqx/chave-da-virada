import { useState } from 'react';
import { BookOpen, Calendar, ChevronLeft, ChevronRight, RefreshCw, Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type OnboardingModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const onboardingSteps = [
    {
        icon: Sparkles,
        title: 'Bem-vindo ao fluxo de revisao!',
        description:
            'Este sistema ajuda voce a consolidar o aprendizado com revisoes programadas. Vamos entender como funciona?',
        image: 'intro',
    },
    {
        icon: BookOpen,
        title: 'Dias de estudo',
        description:
            'Defina quantos dias por semana voce dedica aos estudos. Durante esses dias, voce absorve novos conteudos.',
        image: 'study',
    },
    {
        icon: RefreshCw,
        title: 'Dias de revisao',
        description:
            'Escolha um ou mais dias da semana para revisar. Nesse dia, os topicos estudados aparecem para voce.',
        image: 'review',
    },
    {
        icon: Calendar,
        title: 'Ciclo semanal',
        description:
            'O sistema cria um ciclo: voce estuda durante os dias configurados e revisa nos dias escolhidos.',
        image: 'cycle',
    },
    {
        icon: Settings,
        title: 'Configuracoes avancadas',
        description:
            'Voce pode definir janelas de estudo personalizadas. As configuracoes padrao ja funcionam muito bem.',
        image: 'settings',
    },
];

function StepIllustration({ type }: { type: string }) {
    switch (type) {
        case 'intro':
            return (
                <div className="flex items-center justify-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                    </div>
                    <ChevronRight className="h-6 w-6 text-slate-300" />
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                        <RefreshCw className="h-8 w-8 text-emerald-600" />
                    </div>
                    <ChevronRight className="h-6 w-6 text-slate-300" />
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
                        <Sparkles className="h-8 w-8 text-amber-600" />
                    </div>
                </div>
            );
        case 'study':
            return (
                <div className="flex gap-2">
                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((day, i) => (
                        <div
                            key={day}
                            className={`flex flex-col items-center rounded-lg p-2 ${i < 4 ? 'bg-blue-100' : 'bg-slate-100'}`}
                        >
                            <span className="text-xs font-medium text-slate-600">{day}</span>
                            {i < 4 && <BookOpen className="mt-1 h-4 w-4 text-blue-600" />}
                        </div>
                    ))}
                </div>
            );
        case 'review':
            return (
                <div className="flex gap-2">
                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map((day, i) => (
                        <div
                            key={day}
                            className={`flex flex-col items-center rounded-lg p-2 ${i === 5 ? 'bg-emerald-100 ring-2 ring-emerald-500' : 'bg-slate-100'}`}
                        >
                            <span className="text-xs font-medium text-slate-600">{day}</span>
                            {i === 5 && <RefreshCw className="mt-1 h-4 w-4 text-emerald-600" />}
                        </div>
                    ))}
                </div>
            );
        case 'cycle':
            return (
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-3 text-center">
                        <BookOpen className="mx-auto h-6 w-6 text-blue-600" />
                        <span className="mt-1 block text-xs text-blue-700">Estudar</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                        <span className="text-[10px] text-slate-400">acumula</span>
                    </div>
                    <div className="rounded-lg bg-amber-50 p-3 text-center">
                        <Calendar className="mx-auto h-6 w-6 text-amber-600" />
                        <span className="mt-1 block text-xs text-amber-700">Topicos</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                        <span className="text-[10px] text-slate-400">revisa</span>
                    </div>
                    <div className="rounded-lg bg-emerald-50 p-3 text-center">
                        <RefreshCw className="mx-auto h-6 w-6 text-emerald-600" />
                        <span className="mt-1 block text-xs text-emerald-700">Fixar</span>
                    </div>
                </div>
            );
        case 'settings':
            return (
                <div className="flex gap-3">
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                        <Settings className="mx-auto h-5 w-5 text-slate-600" />
                        <span className="mt-1 block text-xs text-slate-600">Modo</span>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                        <Calendar className="mx-auto h-5 w-5 text-slate-600" />
                        <span className="mt-1 block text-xs text-slate-600">Janela</span>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                        <RefreshCw className="mx-auto h-5 w-5 text-slate-600" />
                        <span className="mt-1 block text-xs text-slate-600">Referencia</span>
                    </div>
                </div>
            );
        default:
            return null;
    }
}

export default function OnboardingModal({ open, onOpenChange }: OnboardingModalProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const step = onboardingSteps[currentStep];
    const Icon = step.icon;

    const handleNext = () => {
        if (currentStep < onboardingSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onOpenChange(false);
            setCurrentStep(0);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <Icon className="h-6 w-6 text-slate-700" />
                    </div>
                    <DialogTitle className="text-center">{step.title}</DialogTitle>
                    <DialogDescription className="text-center">{step.description}</DialogDescription>
                </DialogHeader>

                <div className="flex min-h-[100px] items-center justify-center py-4">
                    <StepIllustration type={step.image} />
                </div>

                <div className="flex justify-center gap-1.5">
                    {onboardingSteps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentStep(index)}
                            className={`h-2 rounded-full transition-all ${
                                index === currentStep ? 'w-6 bg-slate-900' : 'w-2 bg-slate-200 hover:bg-slate-300'
                            }`}
                        />
                    ))}
                </div>

                <div className="flex items-center justify-between pt-4">
                    <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 0} className="gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                    </Button>
                    <Button onClick={handleNext} className="gap-1">
                        {currentStep === onboardingSteps.length - 1 ? 'Comecar' : 'Proximo'}
                        {currentStep < onboardingSteps.length - 1 && <ChevronRight className="h-4 w-4" />}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
