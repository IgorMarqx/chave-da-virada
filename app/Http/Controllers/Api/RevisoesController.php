<?php

namespace App\Http\Controllers\Api;

use App\Models\Revisao;
use App\Services\WeeklyReviewService;

class RevisoesController extends ApiController
{
    public function __construct(
        private readonly WeeklyReviewService $weeklyReviewService
    ) {}

    public function today()
    {
        $user = request()->user();
        $revisoes = $this->weeklyReviewService->getPendingWeeklyRevisoesForToday($user);

        return $this->apiSuccess($revisoes, 'Revisoes fetched successfully');
    }

    public function concluir(int $id)
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
}
