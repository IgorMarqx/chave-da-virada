<?php

namespace App\Http\Requests;

use App\Models\Topico;
use Illuminate\Foundation\Http\FormRequest;

class TopicoRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        if (! $user) {
            return false;
        }

        $topico = $this->route('topico');

        if (! $topico) {
            return true;
        }

        if (! $topico instanceof Topico) {
            return false;
        }

        return (int) $topico->user_id === (int) $user->id;
    }

    public function rules(): array
    {
        if ($this->route('topico')) {
            return [
                'nome' => 'required|string|max:255',
                'descricao' => 'nullable|string',
                'ordem' => 'nullable|integer|min:0',
            ];
        }

        return [
            'disciplina_id' => 'required|exists:disciplinas,id',
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'ordem' => 'nullable|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'disciplina_id.required' => 'A disciplina e obrigatoria.',
            'disciplina_id.exists' => 'A disciplina informada e invalida.',
            'nome.required' => 'O nome do topico e obrigatorio.',
            'nome.string' => 'O nome do topico deve ser um texto valido.',
            'nome.max' => 'O nome do topico deve ter no maximo 255 caracteres.',
            'descricao.string' => 'A descricao deve ser um texto valido.',
            'ordem.integer' => 'A ordem deve ser um numero inteiro.',
            'ordem.min' => 'A ordem deve ser maior ou igual a zero.',
        ];
    }
}
