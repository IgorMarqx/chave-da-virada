<?php

namespace Database\Factories;

use App\Models\Disciplina;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Topico>
 */
class TopicoFactory extends Factory
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
            'disciplina_id' => Disciplina::factory(),
            'nome' => fake()->sentence(3),
            'descricao' => fake()->sentence(),
            'ordem' => fake()->numberBetween(1, 50),
        ];
    }
}
