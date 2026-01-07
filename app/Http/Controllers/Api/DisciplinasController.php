<?php

namespace App\Http\Controllers\Api;

use App\Models\Disciplina;
use App\Services\DisciplinasService;
use Illuminate\Http\Request;

class DisciplinasController extends ApiController
{
    public function __construct(
        private readonly DisciplinasService $disciplinasService
    ) {}

    public function create(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'concurso_id' => 'required|exists:concursos,id',
            'nome' => 'required|string|max:255',
        ]);

        $disciplina = $this->disciplinasService->create([
            ...$data,
            'user_id' => $user->id,
        ]);

        return $this->apiSuccess($disciplina, 'Disciplina created successfully', 201);
    }

    public function listByConcurso(int $concursoId)
    {
        $user = request()->user();
        $disciplinas = $this->disciplinasService->listByConcursoForUser($concursoId, $user->id);

        return $this->apiSuccess($disciplinas, 'Disciplinas fetched successfully');
    }

    public function listRecent()
    {
        $user = request()->user();
        $disciplinas = $this->disciplinasService->listRecentForUser($user->id);

        return $this->apiSuccess($disciplinas, 'Recent disciplinas fetched successfully');
    }

    public function markAccessed(Disciplina $disciplina)
    {
        if ((int) $disciplina->user_id !== (int) request()->user()->id) {
            return $this->apiError('Disciplina not found', null, 404);
        }

        $disciplina->forceFill(['accessed_at' => now()])->save();

        return $this->apiSuccess(null, 'Disciplina accessed_at updated');
    }
}
