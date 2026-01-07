<?php

namespace App\Http\Controllers\Api;

use App\Services\TopicosService;
use Illuminate\Http\Request;

class TopicosController extends ApiController
{
    public function __construct(
        private readonly TopicosService $topicosService
    ) {}

    public function listByDisciplina(int $disciplinaId)
    {
        $user = request()->user();
        $topicos = $this->topicosService->listByDisciplinaForUser($disciplinaId, $user->id);

        return $this->apiSuccess($topicos, 'Topicos fetched successfully');
    }

    public function create(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'disciplina_id' => 'required|exists:disciplinas,id',
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'ordem' => 'nullable|integer|min:0',
        ]);

        $topico = $this->topicosService->create([
            ...$data,
            'user_id' => $user->id,
        ]);

        return $this->apiSuccess($topico, 'Topico created successfully', 201);
    }

    public function show(int $topicoId)
    {
        $user = request()->user();
        $topico = $this->topicosService->findWithProgressForUser($topicoId, $user->id);

        if (! $topico) {
            return $this->apiError('Topico not found', null, 404);
        }

        return $this->apiSuccess($topico, 'Topico fetched successfully');
    }
}
