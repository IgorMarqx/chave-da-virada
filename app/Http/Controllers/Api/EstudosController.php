<?php

namespace App\Http\Controllers\Api;

use App\Services\EstudosService;
use Illuminate\Http\Request;

class EstudosController extends ApiController
{
    public function __construct(
        private readonly EstudosService $estudosService
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
}
