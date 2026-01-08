<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RevisaoConfiguracao>
 */
class RevisaoConfiguracaoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'ativo' => true,
            'modo' => 'semanal',
            'dias_estudo' => 5,
            'dia_revisao' => 6,
            'dias_revisao' => [6],
            'usar_ultima_revisao' => true,
            'janela_estudo_dias' => null,
            'timezone' => 'America/Fortaleza',
        ];
    }
}
