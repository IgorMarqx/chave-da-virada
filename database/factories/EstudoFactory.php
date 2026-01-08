<?php

namespace Database\Factories;

use App\Models\Topico;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Estudo>
 */
class EstudoFactory extends Factory
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
            'tempo_segundos' => fake()->numberBetween(60, 7200),
            'data_estudo' => now()->subMinutes(fake()->numberBetween(1, 300)),
            'origem' => 'manual',
            'observacao' => fake()->sentence(),
        ];
    }
}
