<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\DisciplinaRequest;
use App\Models\Disciplina;
use App\Services\DisciplinasService;
use Illuminate\Http\JsonResponse;

class DisciplinasController extends ApiController
{
    public function __construct(
        private readonly DisciplinasService $disciplinasService
    ) {}

    public function create(DisciplinaRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        $disciplina = $this->disciplinasService->create([
            ...$data,
            'user_id' => $user->id,
        ]);

        return $this->apiSuccess($disciplina, 'Disciplina created successfully', 201);
    }

    public function listByConcurso(int $concursoId): JsonResponse
    {
        $user = request()->user();
        $disciplinas = $this->disciplinasService->listByConcursoForUser($concursoId, $user->id);

        return $this->apiSuccess($disciplinas, 'Disciplinas fetched successfully');
    }

    public function listRecent(): JsonResponse
    {
        $user = request()->user();
        $disciplinas = $this->disciplinasService->listRecentForUser($user->id);

        return $this->apiSuccess($disciplinas, 'Recent disciplinas fetched successfully');
    }

    public function markAccessed(Disciplina $disciplina): JsonResponse
    {
        if ((int) $disciplina->user_id !== (int) request()->user()->id) {
            return $this->apiError('Disciplina not found', null, 404);
        }

        $disciplina->forceFill(['accessed_at' => now()])->save();

        return $this->apiSuccess(null, 'Disciplina accessed_at updated');
    }

    public function update(DisciplinaRequest $request, Disciplina $disciplina): JsonResponse
    {
        $updated = $this->disciplinasService->update($disciplina, $request->validated());

        return $this->apiSuccess($updated, 'Disciplina updated successfully');
    }

    public function destroy(Disciplina $disciplina): JsonResponse
    {
        if ((int) $disciplina->user_id !== (int) request()->user()->id) {
            return $this->apiError('Disciplina not found', null, 404);
        }

        $this->disciplinasService->delete($disciplina);

        return $this->apiSuccess(null, 'Disciplina deleted successfully');
    }
}
