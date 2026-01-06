<?php

namespace App\Services;

use App\Models\Concurso;
use App\Repositories\ConcursosRepository;

class ConcursosService
{
    public function __construct(
        private readonly ConcursosRepository $concursosRepository
    ) {}

    public function create(array $data): Concurso
    {
        return $this->concursosRepository->create($data);
    }

    public function listForUser(int $userId)
    {
        return $this->concursosRepository->allWithProgressForUser($userId);
    }
}
