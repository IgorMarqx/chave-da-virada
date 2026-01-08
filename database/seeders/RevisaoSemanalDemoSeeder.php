<?php

namespace Database\Seeders;

use App\Models\Concurso;
use App\Models\Disciplina;
use App\Models\Estudo;
use App\Models\RevisaoConfiguracao;
use App\Models\Topico;
use App\Models\User;
use App\Services\WeeklyReviewService;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;

class RevisaoSemanalDemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $timezone = WeeklyReviewService::DEFAULT_TIMEZONE;
        $today = CarbonImmutable::now($timezone)->startOfDay();

        $user = User::factory()->create([
            'name' => 'Demo Revisao',
            'email' => 'demo.revisao@example.com',
        ]);

        $concurso = Concurso::factory()->create(['user_id' => $user->id]);
        $disciplina = Disciplina::factory()->create([
            'user_id' => $user->id,
            'concurso_id' => $concurso->id,
        ]);

        $topicos = Topico::factory()
            ->count(3)
            ->create([
                'user_id' => $user->id,
                'disciplina_id' => $disciplina->id,
            ]);

        RevisaoConfiguracao::query()->create([
            'user_id' => $user->id,
            'ativo' => true,
            'modo' => 'semanal',
            'dias_estudo' => 5,
            'dia_revisao' => $today->dayOfWeek,
            'dias_revisao' => [$today->dayOfWeek],
            'usar_ultima_revisao' => false,
            'janela_estudo_dias' => 5,
            'timezone' => $timezone,
        ]);

        foreach ($topicos as $topico) {
            for ($daysAgo = 1; $daysAgo <= 5; $daysAgo++) {
                Estudo::factory()->create([
                    'user_id' => $user->id,
                    'topico_id' => $topico->id,
                    'data_estudo' => $today->subDays($daysAgo)->addHours(10),
                    'origem' => 'seeder',
                ]);
            }
        }

        app(WeeklyReviewService::class)->generateForActiveUsers();
    }
}
