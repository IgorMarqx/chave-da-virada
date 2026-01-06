import type { Concurso, Disciplina, StatusConfig, Topico } from './types';

export const concursos: Concurso[] = [
    {
        id: 'c1',
        nome: 'Analista TRF 3',
        banca: 'Vunesp',
        orgao: 'TRF 3',
        progresso: 62,
        ultimaAtividade: 'Ultimo estudo: ha 2 dias',
    },
    {
        id: 'c2',
        nome: 'Auditor Fiscal SP',
        banca: 'FGV',
        orgao: 'SEFAZ SP',
        progresso: 35,
        ultimaAtividade: 'Ultimo estudo: ontem',
    },
    {
        id: 'c3',
        nome: 'Policia Civil',
        progresso: 12,
        ultimaAtividade: 'Ultimo estudo: ha 5 dias',
    },
];

export const disciplinas: Disciplina[] = [
    {
        id: 'd1',
        nome: 'Direito Constitucional',
        topicos: 18,
        progresso: 48,
    },
    {
        id: 'd2',
        nome: 'Raciocinio Logico',
        topicos: 12,
        progresso: 72,
    },
    {
        id: 'd3',
        nome: 'Informatica',
        topicos: 9,
        progresso: 25,
    },
];

export const topicos: Topico[] = [
    {
        id: 't1',
        nome: 'Controle de constitucionalidade',
        status: 'em-andamento',
        proximaRevisao: 'Amanha',
    },
    {
        id: 't2',
        nome: 'Direitos fundamentais',
        status: 'concluido',
        proximaRevisao: 'Em 7 dias',
    },
    {
        id: 't3',
        nome: 'Poder Legislativo',
        status: 'nao-iniciado',
    },
];

export const statusConfig: StatusConfig = {
    'nao-iniciado': {
        label: 'Nao iniciado',
        className: 'bg-slate-100 text-slate-600',
    },
    'em-andamento': {
        label: 'Em andamento',
        className: 'bg-rose-100 text-rose-700',
    },
    concluido: {
        label: 'Concluido',
        className: 'bg-red-100 text-red-700',
    },
};
