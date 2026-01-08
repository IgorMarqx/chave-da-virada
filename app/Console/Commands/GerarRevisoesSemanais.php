<?php

namespace App\Console\Commands;

use App\Services\WeeklyReviewService;
use Illuminate\Console\Command;

class GerarRevisoesSemanais extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'revisoes:gerar-semanal';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Gera revisoes semanais pendentes para usuarios com ciclo ativo';

    /**
     * Execute the console command.
     */
    public function handle(WeeklyReviewService $weeklyReviewService): int
    {
        $generated = $weeklyReviewService->generateForActiveUsers();

        $this->info("Revisoes geradas: {$generated}");

        return Command::SUCCESS;
    }
}
