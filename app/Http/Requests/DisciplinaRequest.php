<?php

namespace App\Http\Requests;

use App\Models\Disciplina;
use Illuminate\Foundation\Http\FormRequest;

class DisciplinaRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        if (! $user) {
            return false;
        }

        $disciplina = $this->route('disciplina');

        if (! $disciplina) {
            return true;
        }

        if (! $disciplina instanceof Disciplina) {
            return false;
        }

        return (int) $disciplina->user_id === (int) $user->id;
    }

    public function rules(): array
    {
        if ($this->route('disciplina')) {
            return [
                'nome' => 'required|string|max:255',
            ];
        }

        return [
            'concurso_id' => 'required|exists:concursos,id',
            'nome' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'concurso_id.required' => 'O concurso e obrigatorio.',
            'concurso_id.exists' => 'O concurso informado e invalido.',
            'nome.required' => 'O nome da disciplina e obrigatorio.',
            'nome.string' => 'O nome da disciplina deve ser um texto valido.',
            'nome.max' => 'O nome da disciplina deve ter no maximo 255 caracteres.',
        ];
    }
}
