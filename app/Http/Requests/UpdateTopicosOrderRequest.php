<?php

namespace App\Http\Requests;

use App\Models\Topico;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateTopicosOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'disciplina_id' => 'required|integer|exists:disciplinas,id',
            'topicos' => 'required|array|min:1',
            'topicos.*' => 'required|integer|distinct|exists:topicos,id',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'disciplina_id.required' => 'A disciplina e obrigatoria.',
            'disciplina_id.exists' => 'A disciplina informada nao foi encontrada.',
            'topicos.required' => 'A lista de topicos e obrigatoria.',
            'topicos.array' => 'A lista de topicos deve ser um array.',
            'topicos.min' => 'A lista de topicos deve ter pelo menos um item.',
            'topicos.*.distinct' => 'A lista de topicos nao pode ter itens repetidos.',
            'topicos.*.exists' => 'Um ou mais topicos informados nao foram encontrados.',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $topicoIds = $this->input('topicos', []);
            $disciplinaId = $this->integer('disciplina_id');
            $user = $this->user();

            if (empty($topicoIds) || ! $disciplinaId || ! $user) {
                return;
            }

            $count = Topico::query()
                ->where('disciplina_id', $disciplinaId)
                ->where('user_id', $user->id)
                ->whereIn('id', $topicoIds)
                ->count();

            if ($count !== count($topicoIds)) {
                $validator->errors()->add('topicos', 'Um ou mais topicos nao pertencem a esta disciplina.');
            }
        });
    }
}
