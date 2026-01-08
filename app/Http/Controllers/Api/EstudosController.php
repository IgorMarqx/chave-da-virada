<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\EstudosTopicosRequest;
use App\Services\EstudosService;
use App\Services\TopicosService;
use App\Services\WeeklyReviewService;
use Illuminate\Http\Request;

class EstudosController extends ApiController
{
    public function __construct(
        private readonly EstudosService $estudosService,
        private readonly TopicosService $topicosService,
        private readonly WeeklyReviewService $weeklyReviewService,
    ) {}

    public function listByTopico(int $topicoId)
    {
        $user = request()->user();
        $estudos = $this->estudosService->listByTopicoForUser($topicoId, $user->id);

        return $this->apiSuccess($estudos, 'Estudos fetched successfully');
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'topico_id' => 'required|exists:topicos,id',
            'tempo_segundos' => 'required|integer|min:1',
            'data_estudo' => 'required|date',
            'origem' => 'nullable|string|max:30',
            'observacao' => 'nullable|string',
        ]);

        $estudo = $this->estudosService->createForUser($user->id, $data);

        return $this->apiSuccess($estudo, 'Estudo created successfully', 201);
    }

    public function listTopicos(EstudosTopicosRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();
        $disciplinaId = $validated['disciplina_id'] ?? null;

        $excludeTopicoIds = [];
        if ($this->weeklyReviewService->isReviewDayForUser($user)) {
            $excludeTopicoIds = $this->weeklyReviewService
                ->getPendingWeeklyTopicoIdsForToday($user)
                ->all();
        }

        $topicos = $this->topicosService->listForUser($user->id, $disciplinaId, $excludeTopicoIds);

        return $this->apiSuccess($topicos, 'Topicos fetched successfully');
    }
}
