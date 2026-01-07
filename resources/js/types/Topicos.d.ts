export type CreateTopicoData = {
    disciplina_id: number;
    nome: string;
    descricao?: string | null;
    ordem?: number | null;
};

export type UpdateTopicoData = {
    nome: string;
    descricao?: string | null;
    ordem?: number | null;
};
