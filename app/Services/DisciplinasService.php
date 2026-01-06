<?php

namespace App\Services;

use App\Models\Disciplina;
use App\Repositories\DisciplinasRepository;

class DisciplinasService
{
    public function __construct(
        private readonly DisciplinasRepository $disciplinasRepository
    ) {}

    public function create(array $data): Disciplina
    {
        return $this->disciplinasRepository->create($data);
    }

    public function listByConcursoForUser(int $concursoId, int $userId)
    {
        return $this->disciplinasRepository->listByConcursoForUser($concursoId, $userId);
    }
}
