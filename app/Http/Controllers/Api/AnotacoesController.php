<?php

namespace App\Http\Controllers\Api;

use App\Services\AnotacoesService;
use Illuminate\Http\Request;

class AnotacoesController extends ApiController
{
    public function __construct(
        private readonly AnotacoesService $anotacoesService
    ) {}

    public function showByTopico(int $topicoId)
    {
        $user = request()->user();
        $anotacao = $this->anotacoesService->findByTopicoForUser($topicoId, $user->id);

        return $this->apiSuccess($anotacao, 'Anotacao fetched successfully');
    }

    public function upsert(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'topico_id' => 'required|exists:topicos,id',
            'titulo' => 'nullable|string|max:120',
            'conteudo' => 'required|string',
        ]);

        $anotacao = $this->anotacoesService->upsertForUser($user->id, $data);

        return $this->apiSuccess($anotacao, 'Anotacao saved successfully', 201);
    }
}
