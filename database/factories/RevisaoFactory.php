<?php

namespace Database\Factories;

use App\Models\Topico;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Revisao>
 */
class RevisaoFactory extends Factory
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
            'topico_id' => Topico::factory(),
            'data_revisao' => now()->startOfDay(),
            'status' => 'pendente',
            'tipo' => 'semanal',
            'intervalo_dias' => fake()->numberBetween(1, 15),
            'ease_factor' => fake()->randomFloat(3, 1.3, 3.0),
            'repeticoes' => fake()->numberBetween(0, 10),
            'origem' => 'ciclo_semanal',
        ];
    }
}
