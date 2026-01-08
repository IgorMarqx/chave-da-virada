<?php

namespace Database\Seeders;

use App\Models\RevisaoConfiguracao;
use App\Models\User;
use Illuminate\Database\Seeder;

class RevisaoConfiguracaoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::query()->each(function (User $user): void {
            RevisaoConfiguracao::query()->firstOrCreate(
                ['user_id' => $user->id],
                [
                    'ativo' => true,
                    'modo' => 'semanal',
                    'dias_estudo' => 5,
                    'dia_revisao' => 6,
                    'dias_revisao' => [6],
                    'usar_ultima_revisao' => true,
                    'janela_estudo_dias' => null,
                    'timezone' => 'America/Fortaleza',
                ],
            );
        });
    }
}
