<?php

namespace App\Http\Controllers\Api;

use App\Services\ConcursosService;
use Illuminate\Http\Request;

class ConcursosController extends ApiController
{
    public function __construct(private readonly ConcursosService $concursosService) {}

    public function create(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'nome' => 'required|string|max:255',
            'orgao' => 'required|string|max:255',
            'data_prova' => 'nullable|date',
            'descricao' => 'nullable|string',
        ]);

        $concurso = $this->concursosService->create([
            ...$data,
            'user_id' => $user->id,
        ]);

        return $this->apiSuccess($concurso, 'Concurso created successfully', 201);
    }

    public function index()
    {
        $user = request()->user();
        $concursos = $this->concursosService->listForUser($user->id);

        return $this->apiSuccess($concursos, 'Concursos fetched successfully');
    }
}
