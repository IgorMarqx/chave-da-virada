import { type RevisaoConfiguracao } from '@/hooks/Revisoes/useGetRevisaoConfiguracao';

export type FormState = {
    ativo: boolean;
    modo: RevisaoConfiguracao['modo'];
    dias_estudo: number;
    dias_revisao: number[];
    usar_ultima_revisao: boolean;
    janela_estudo_dias: number | null;
    timezone: string;
};

export const buildFormState = (config: RevisaoConfiguracao | null): FormState => ({
    ativo: config?.ativo ?? true,
    modo: config?.modo ?? 'semanal',
    dias_estudo: config?.dias_estudo ?? 5,
    dias_revisao: config?.dias_revisao ?? [config?.dia_revisao ?? 6],
    usar_ultima_revisao: config?.usar_ultima_revisao ?? true,
    janela_estudo_dias: config?.janela_estudo_dias ?? null,
    timezone: config?.timezone ?? '',
});

export const dayOptions = [
    { value: 0, label: 'Domingo', short: 'Dom' },
    { value: 1, label: 'Segunda', short: 'Seg' },
    { value: 2, label: 'Terca', short: 'Ter' },
    { value: 3, label: 'Quarta', short: 'Qua' },
    { value: 4, label: 'Quinta', short: 'Qui' },
    { value: 5, label: 'Sexta', short: 'Sex' },
    { value: 6, label: 'Sabado', short: 'Sab' },
];

export const modeOptions = [
    { value: 'semanal', label: 'Semanal' },
    { value: 'intervalos', label: 'Intervalos' },
    { value: 'misto', label: 'Misto' },
];
