<?php

namespace App\Http\Requests;

use App\Models\Concurso;
use Illuminate\Foundation\Http\FormRequest;

class ConcursoRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        if (! $user) {
            return false;
        }

        $concurso = $this->route('concurso');

        if (! $concurso) {
            return true;
        }

        if (! $concurso instanceof Concurso) {
            return false;
        }

        return (int) $concurso->user_id === (int) $user->id;
    }

    public function rules(): array
    {
        return [
            'nome' => 'required|string|max:255',
            'orgao' => 'required|string|max:255',
            'data_prova' => 'nullable|date',
            'descricao' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required' => 'O nome do concurso e obrigatorio.',
            'nome.string' => 'O nome do concurso deve ser um texto valido.',
            'nome.max' => 'O nome do concurso deve ter no maximo 255 caracteres.',
            'orgao.required' => 'O orgao do concurso e obrigatorio.',
            'orgao.string' => 'O orgao do concurso deve ser um texto valido.',
            'orgao.max' => 'O orgao do concurso deve ter no maximo 255 caracteres.',
            'data_prova.date' => 'A data da prova deve ser uma data valida.',
            'descricao.string' => 'A descricao deve ser um texto valido.',
        ];
    }
}
