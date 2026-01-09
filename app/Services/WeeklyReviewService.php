<?php

namespace App\Services;

use App\Models\Estudo;
use App\Models\Revisao;
use App\Models\RevisaoConfiguracao;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Collection;

class WeeklyReviewService
{
    public const DEFAULT_TIMEZONE = 'America/Sao_Paulo';

    public function generateForActiveUsers(): int
    {
        $generated = 0;

        RevisaoConfiguracao::query()
            ->where('ativo', true)
            ->where('modo', 'semanal')
            ->each(function (RevisaoConfiguracao $config) use (&$generated): void {
                $generated += $this->generateForConfig($config);
            });

        return $generated;
    }

    public function generateForConfig(RevisaoConfiguracao $config): int
    {
        $today = $this->todayStartForConfig($config);

        if (! $this->isReviewDay($config, $today)) {
            return 0;
        }

        [$windowStart, $windowEnd] = $this->resolveWindow($config, $today);

        $topicoIds = Estudo::query()
            ->where('user_id', $config->user_id)
            ->whereBetween('data_estudo', [$windowStart, $windowEnd])
            ->distinct()
            ->pluck('topico_id');

        foreach ($topicoIds as $topicoId) {
            Revisao::query()->firstOrCreate(
                [
                    'user_id' => $config->user_id,
                    'topico_id' => $topicoId,
                    'data_revisao' => $today,
                    'tipo' => 'semanal',
                ],
                [
                    'status' => 'pendente',
                    'origem' => 'ciclo_semanal',
                ],
            );
        }

        return $topicoIds->count();
    }

    /**
     * @return array{0: CarbonImmutable, 1: CarbonImmutable}
     */
    public function resolveWindow(RevisaoConfiguracao $config, CarbonImmutable $today): array
    {
        $windowEnd = $today;

        if ($config->usar_ultima_revisao) {
            $lastReview = Revisao::query()
                ->where('user_id', $config->user_id)
                ->where('status', 'concluida')
                ->where('tipo', 'semanal')
                ->latest('data_revisao')
                ->first();

            if ($lastReview?->data_revisao) {
                return [
                    CarbonImmutable::instance($lastReview->data_revisao)->addSecond(),
                    $windowEnd,
                ];
            }

            return [
                $today->subDays($config->dias_estudo),
                $windowEnd,
            ];
        }

        $days = $config->janela_estudo_dias ?? $config->dias_estudo;

        return [
            $today->subDays($days),
            $windowEnd,
        ];
    }

    public function getPendingWeeklyRevisoesForToday(User $user)
    {
        $config = $this->getActiveWeeklyConfig($user);

        if (! $config) {
            return collect();
        }

        $today = $this->todayStartForConfig($config);

        if (! $this->isReviewDay($config, $today)) {
            return collect();
        }

        $todayEnd = $today->endOfDay();

        return Revisao::query()
            ->with(['topico.disciplina.concurso'])
            ->where('user_id', $user->id)
            ->whereIn('status', ['pendente', 'em_andamento'])
            ->where('tipo', 'semanal')
            ->whereBetween('data_revisao', [$today, $todayEnd])
            ->get();
    }

    /**
     * @return Collection<int, int>
     */
    public function getPendingWeeklyTopicoIdsForToday(User $user)
    {
        return $this->getPendingWeeklyRevisoesForToday($user)->pluck('topico_id');
    }

    public function isReviewDayForUser(User $user): bool
    {
        $config = $this->getActiveWeeklyConfig($user);

        if (! $config) {
            return false;
        }

        $today = $this->todayStartForConfig($config);

        return $this->isReviewDay($config, $today);
    }

    public function todayStartForConfig(RevisaoConfiguracao $config): CarbonImmutable
    {
        return CarbonImmutable::now($this->resolveTimezone($config))->startOfDay();
    }

    private function resolveTimezone(RevisaoConfiguracao $config): string
    {
        return $config->timezone ?: self::DEFAULT_TIMEZONE;
    }

    private function getActiveWeeklyConfig(User $user): ?RevisaoConfiguracao
    {
        return RevisaoConfiguracao::query()
            ->where('user_id', $user->id)
            ->where('ativo', true)
            ->where('modo', 'semanal')
            ->first();
    }

    private function isReviewDay(RevisaoConfiguracao $config, CarbonImmutable $today): bool
    {
        $reviewDays = $this->resolveReviewDays($config);

        return in_array($today->dayOfWeek, $reviewDays, true);
    }

    /**
     * @return array<int, int>
     */
    private function resolveReviewDays(RevisaoConfiguracao $config): array
    {
        $days = $config->dias_revisao ?? [];

        if ($days === []) {
            return [$config->dia_revisao];
        }

        return array_values(array_unique(array_map('intval', $days)));
    }
}
