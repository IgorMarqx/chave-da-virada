export type Concurso = {
    id: string;
    nome: string;
    banca?: string;
    orgao?: string;
    progresso: number;
    ultimaAtividade: string;
};

export type Disciplina = {
    id: string;
    nome: string;
    topicos: number;
    progresso: number;
};

export type Topico = {
    id: string;
    nome: string;
    status: 'nao-iniciado' | 'em-andamento' | 'concluido';
    proximaRevisao?: string;
};

export type StatusConfig = Record<Topico['status'], { label: string; className: string }>;
