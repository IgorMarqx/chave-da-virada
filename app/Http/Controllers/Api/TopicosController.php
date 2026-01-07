<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\TopicoRequest;
use App\Http\Requests\UpdateTopicosOrderRequest;
use App\Models\Topico;
use App\Services\TopicosService;
use Illuminate\Http\JsonResponse;

class TopicosController extends ApiController
{
    public function __construct(
        private readonly TopicosService $topicosService
    ) {}

    public function listByDisciplina(int $disciplinaId): JsonResponse
    {
        $user = request()->user();
        $topicos = $this->topicosService->listByDisciplinaForUser($disciplinaId, $user->id);

        return $this->apiSuccess($topicos, 'Topicos fetched successfully');
    }

    public function create(TopicoRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        $topico = $this->topicosService->create([
            ...$data,
            'user_id' => $user->id,
        ]);

        return $this->apiSuccess($topico, 'Topico created successfully', 201);
    }

    public function show(int $topicoId): JsonResponse
    {
        $user = request()->user();
        $topico = $this->topicosService->findWithProgressForUser($topicoId, $user->id);

        if (! $topico) {
            return $this->apiError('Topico not found', null, 404);
        }

        return $this->apiSuccess($topico, 'Topico fetched successfully');
    }

    public function update(TopicoRequest $request, Topico $topico): JsonResponse
    {
        $updated = $this->topicosService->update($topico, $request->validated());

        return $this->apiSuccess($updated, 'Topico updated successfully');
    }

    public function destroy(Topico $topico): JsonResponse
    {
        if ((int) $topico->user_id !== (int) request()->user()->id) {
            return $this->apiError('Topico not found', null, 404);
        }

        $this->topicosService->delete($topico);

        return $this->apiSuccess(null, 'Topico deleted successfully');
    }

    public function updateOrder(UpdateTopicosOrderRequest $request): JsonResponse
    {
        $user = $request->user();
        $topicos = $this->topicosService->reorderForUser(
            $request->integer('disciplina_id'),
            $user->id,
            $request->input('topicos', [])
        );

        return $this->apiSuccess($topicos, 'Topicos order updated successfully');
    }
}
