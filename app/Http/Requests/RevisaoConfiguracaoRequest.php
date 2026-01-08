<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RevisaoConfiguracaoRequest extends FormRequest
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
            'ativo' => 'nullable|boolean',
            'modo' => 'nullable|string|in:semanal,intervalos,misto',
            'dias_estudo' => 'nullable|integer|min:1|max:7',
            'dia_revisao' => 'nullable|integer|min:0|max:6',
            'dias_revisao' => 'nullable|array|min:1',
            'dias_revisao.*' => 'integer|min:0|max:6|distinct',
            'usar_ultima_revisao' => 'nullable|boolean',
            'janela_estudo_dias' => 'nullable|integer|min:1|max:90',
            'timezone' => 'nullable|string|max:60',
        ];
    }

    public function messages(): array
    {
        return [
            'modo.in' => 'Modo invalido. Use semanal, intervalos ou misto.',
            'dia_revisao.min' => 'Dia de revisao deve estar entre 0 e 6.',
            'dia_revisao.max' => 'Dia de revisao deve estar entre 0 e 6.',
            'dias_estudo.min' => 'Dias de estudo deve ser no minimo 1.',
            'dias_estudo.max' => 'Dias de estudo deve ser no maximo 7.',
        ];
    }
}
