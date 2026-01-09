<?php

namespace App\Http\Controllers\Api;

use App\Models\Revisao;
use App\Services\WeeklyReviewService;
use Illuminate\Http\JsonResponse;

class RevisoesController extends ApiController
{
    public function __construct(
        private readonly WeeklyReviewService $weeklyReviewService
    ) {}

    public function today(): JsonResponse
    {
        $user = request()->user();
        $revisoes = $this->weeklyReviewService->getPendingWeeklyRevisoesForToday($user);

        return $this->apiSuccess($revisoes, 'Revisoes fetched successfully');
    }

    public function concluir(int $id): JsonResponse
    {
        $user = request()->user();

        $revisao = Revisao::query()
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $revisao->status = 'concluida';
        $revisao->save();

        return $this->apiSuccess($revisao->refresh(), 'Revisao concluida com sucesso');
    }

    public function iniciar(int $id): JsonResponse
    {
        $user = request()->user();

        $revisao = Revisao::query()
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        if ($revisao->status === 'concluida') {
            return $this->apiError('Revisao ja concluida.', null, 422);
        }

        if ($revisao->status !== 'em_andamento') {
            $revisao->status = 'em_andamento';
            $revisao->save();
        }

        return $this->apiSuccess($revisao->refresh(), 'Revisao em andamento');
    }
}
