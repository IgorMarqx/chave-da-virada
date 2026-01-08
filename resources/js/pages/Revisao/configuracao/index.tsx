import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { BookOpen, Calendar, RefreshCw, Sparkles } from 'lucide-react';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notifications } from '@/components/ui/notification';
import { useGetRevisaoConfiguracao } from '@/hooks/Revisoes/useGetRevisaoConfiguracao';
import { useUpdateRevisaoConfiguracao } from '@/hooks/Revisoes/useUpdateRevisaoConfiguracao';
import CyclePreview from '@/pages/Revisao/configuracao/components/CyclePreview';
import HowItWorks from '@/pages/Revisao/configuracao/components/HowItWorks';
import InfoTooltip from '@/pages/Revisao/configuracao/components/InfoTooltip';
import OnboardingModal from '@/pages/Revisao/configuracao/components/OnboardingModal';
import { buildFormState, dayOptions, type FormState } from '@/pages/Revisao/configuracao/components/formState';
import ReviewStatusCard from './components/ReviewStatusCard';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Estudos', href: '/estudos' },
    { title: 'Revisao', href: '/estudos/revisao' },
    { title: 'Configuracao', href: '/estudos/revisao/configuracao' },
];

export default function RevisaoConfiguracaoPage() {
    const { config, isLoading, error, fetchConfiguracao } = useGetRevisaoConfiguracao();
    const { updateConfiguracao, isSaving } = useUpdateRevisaoConfiguracao();
    const [formState, setFormState] = useState<FormState>(() => buildFormState(null));
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

    useEffect(() => {
        fetchConfiguracao();
    }, [fetchConfiguracao]);

    useEffect(() => {
        if (config) {
            setFormState(buildFormState(config));
        }
    }, [config]);

    const isJanelaEnabled = useMemo(() => !formState.usar_ultima_revisao, [formState.usar_ultima_revisao]);
    const selectedDays = useMemo(() => new Set(formState.dias_revisao), [formState.dias_revisao]);

    const toggleDay = (day: number) => {
        setFormState((state) => {
            const next = new Set(state.dias_revisao);
            if (next.has(day)) {
                next.delete(day);
            } else {
                next.add(day);
            }

            const values = Array.from(next);
            return { ...state, dias_revisao: values.length === 0 ? state.dias_revisao : values };
        });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (formState.dias_revisao.length === 0) {
            notifications.danger('Selecione ao menos um dia de revisao.');
            return;
        }

        const saved = await updateConfiguracao({
            ativo: formState.ativo,
            modo: 'semanal',
            dias_estudo: formState.dias_estudo,
            dias_revisao: formState.dias_revisao,
            usar_ultima_revisao: formState.usar_ultima_revisao,
            janela_estudo_dias: isJanelaEnabled ? formState.janela_estudo_dias : null,
            timezone: formState.timezone.trim() === '' ? null : formState.timezone.trim(),
        });

        if (saved) {
            notifications.success('Configuracao salva com sucesso.');
            fetchConfiguracao();
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuracao de revisao" />

            <OnboardingModal open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen} />

            <div className="flex h-full w-full min-w-0 flex-1 flex-col gap-6 overflow-x-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-red-50 to-rose-50 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Configuracao de revisao</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Ajuste o ciclo semanal e escolha dias de revisao que funcionem para voce.
                        </p>
                    </div>
                    <Button variant="outline" className="gap-2" onClick={() => setIsOnboardingOpen(true)}>
                        <Sparkles className="h-4 w-4" />
                        Ver guia rapido
                    </Button>
                </div>

                <InputError message={error ?? undefined} />

                <HowItWorks />

                <ReviewStatusCard
                    ativo={formState.ativo}
                    onToggle={(nextValue) => {
                        setFormState((state) => ({
                            ...state,
                            ativo: nextValue,
                        }));
                    }}
                />

                {isLoading ? (
                    <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                        <Spinner />
                        Carregando configuracao...
                    </div>
                ) : (
                    <div className="grid gap-6">
                        <form
                            onSubmit={handleSubmit}
                            className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Calendar className="h-4 w-4 text-blue-500" />
                                        Ciclo Semanal
                                        <InfoTooltip content="Configure quantos dias voce estuda e em qual dia da semana quer revisar. O sistema ira agrupar todos os topicos estudados para revisao no dia escolhido." />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="dias_estudo" className="flex items-center text-sm">
                                                <BookOpen className="mr-2 h-4 w-4 text-blue-500" />
                                                Dias de estudo por semana
                                                <InfoTooltip content="Quantos dias por semana voce dedica aos estudos. Os topicos estudados nesses dias serao acumulados para revisao." />
                                            </Label>
                                            <Input
                                                id="dias_estudo"
                                                type="number"
                                                min={1}
                                                max={6}
                                                value={formState.dias_estudo}
                                                onChange={(event) =>
                                                    setFormState((state) => ({
                                                        ...state,
                                                        dias_estudo: Number(event.target.value || 1),
                                                    }))
                                                }
                                            />
                                            <p className="text-xs text-slate-500">
                                                Recomendado: 4-5 dias para melhor equilibrio
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="flex items-center text-sm">
                                                <RefreshCw className="mr-2 h-4 w-4 text-emerald-500" />
                                                Dias de revisao semanal
                                                <InfoTooltip content="Escolha um ou mais dias da semana para revisar. Selecione pelo menos um dia para o ciclo semanal." />
                                            </Label>
                                            <div className="flex flex-wrap gap-2">
                                                {dayOptions.map((day) => (
                                                    <button
                                                        key={day.value}
                                                        type="button"
                                                        onClick={() => toggleDay(day.value)}
                                                        className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition ${selectedDays.has(day.value)
                                                                ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-400'
                                                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                            }`}
                                                    >
                                                        <span>{day.short}</span>
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                Escolha dias com mais tempo disponivel
                                            </p>
                                        </div>
                                    </div>

                                    <CyclePreview diasEstudo={formState.dias_estudo} diasRevisao={formState.dias_revisao} />
                                </CardContent>
                            </Card>

                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id="usar_ultima_revisao"
                                    checked={formState.usar_ultima_revisao}
                                    onCheckedChange={(checked) =>
                                        setFormState((state) => ({
                                            ...state,
                                            usar_ultima_revisao: Boolean(checked),
                                        }))
                                    }
                                />
                                <div>
                                    <Label htmlFor="usar_ultima_revisao" className="text-sm font-semibold text-slate-900">
                                        Usar ultima revisao concluida como referencia
                                    </Label>
                                    <p className="text-xs text-slate-500">
                                        Quando ativado, o sistema calcula a janela a partir da ultima revisao semanal.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-2 md:max-w-xs">
                                <Label htmlFor="janela_estudo_dias">Janela de estudo (dias)</Label>
                                <Input
                                    id="janela_estudo_dias"
                                    type="number"
                                    min={1}
                                    max={90}
                                    disabled={!isJanelaEnabled}
                                    value={formState.janela_estudo_dias ?? ''}
                                    onChange={(event) =>
                                        setFormState((state) => ({
                                            ...state,
                                            janela_estudo_dias: event.target.value === '' ? null : Number(event.target.value),
                                        }))
                                    }
                                />
                                <p className="text-xs text-slate-500">
                                    Configure somente se desativar a opcao de ultima revisao.
                                </p>
                            </div>

                            <div className="grid gap-2 md:max-w-md">
                                <Label htmlFor="timezone">Timezone</Label>
                                <Input
                                    id="timezone"
                                    placeholder="America/Fortaleza"
                                    value={formState.timezone}
                                    onChange={(event) =>
                                        setFormState((state) => ({
                                            ...state,
                                            timezone: event.target.value,
                                        }))
                                    }
                                />
                                <p className="text-xs text-slate-500">Se vazio, usa America/Fortaleza.</p>
                            </div>

                            <div className="flex items-center justify-end">
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving ? 'Salvando...' : 'Salvar configuracao'}
                                </Button>
                            </div>
                        </form>

                    </div>
                )}
            </div>
        </AppLayout>
    );
}
