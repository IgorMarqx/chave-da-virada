export type CreateConcursoData = {
    nome: string;
    orgao: string;
    data_prova?: string;
    descricao?: string;
}

export type Concurso = {
    id: number;
    nome: string;
    orgao: string;
    data_prova?: string | null;
    descricao?: string | null;
    progresso: number;
    created_at?: string;
    updated_at?: string;
};
