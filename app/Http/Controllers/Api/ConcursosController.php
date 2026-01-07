<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\ConcursoRequest;
use App\Models\Concurso;
use App\Services\ConcursosService;
use Illuminate\Http\JsonResponse;

class ConcursosController extends ApiController
{
    public function __construct(private readonly ConcursosService $concursosService) {}

    public function create(ConcursoRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        $concurso = $this->concursosService->create([
            ...$data,
            'user_id' => $user->id,
        ]);

        return $this->apiSuccess($concurso, 'Concurso created successfully', 201);
    }

    public function index(): JsonResponse
    {
        $user = request()->user();
        $concursos = $this->concursosService->listForUser($user->id);

        return $this->apiSuccess($concursos, 'Concursos fetched successfully');
    }

    public function update(ConcursoRequest $request, Concurso $concurso): JsonResponse
    {
        $updated = $this->concursosService->update($concurso, $request->validated());

        return $this->apiSuccess($updated, 'Concurso updated successfully');
    }

    public function destroy(Concurso $concurso): JsonResponse
    {
        if ((int) $concurso->user_id !== (int) request()->user()->id) {
            return $this->apiError('Concurso not found', null, 404);
        }

        $this->concursosService->delete($concurso);

        return $this->apiSuccess(null, 'Concurso deleted successfully');
    }
}
