<?php

namespace App\Http\Controllers\Api;

use App\Models\Arquivo;
use App\Services\ArquivosService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArquivosController extends ApiController
{
    public function __construct(
        private readonly ArquivosService $arquivosService
    ) {}

    public function listByTopico(int $topicoId): JsonResponse
    {
        $user = request()->user();
        $arquivos = $this->arquivosService->listByTopicoForUser($topicoId, $user->id);

        return $this->apiSuccess($arquivos, 'Arquivos fetched successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validate([
            'topico_id' => 'required|exists:topicos,id',
            'tipo' => 'required|string|in:pdf,doc,image',
            'file' => 'required|file|max:10240',
        ]);

        $this->arquivosService->queueStoreForUser(
            $user->id,
            (int) $data['topico_id'],
            $data['tipo'],
            $request->file('file')
        );

        return $this->apiSuccess(null, 'Arquivo em processamento', 202);
    }

    public function destroy(int $arquivoId): JsonResponse
    {
        $user = request()->user();
        $arquivo = Arquivo::query()
            ->where('id', $arquivoId)
            ->where('user_id', $user->id)
            ->first();

        if (! $arquivo) {
            return $this->apiError('Arquivo not found', null, 404);
        }

        $this->arquivosService->deleteForUser($arquivo);

        return $this->apiSuccess(null, 'Arquivo deleted successfully');
    }
}
