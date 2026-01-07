<?php

namespace App\Services;

use App\Models\Concurso;
use App\Repositories\ConcursosRepository;
use Illuminate\Database\Eloquent\Collection;

class ConcursosService
{
    public function __construct(
        private readonly ConcursosRepository $concursosRepository
    ) {}

    public function create(array $data): Concurso
    {
        return $this->concursosRepository->create($data);
    }

    public function listForUser(int $userId): Collection
    {
        return $this->concursosRepository->allWithProgressForUser($userId);
    }

    public function update(Concurso $concurso, array $data): Concurso
    {
        return $this->concursosRepository->update($concurso, $data);
    }

    public function delete(Concurso $concurso): void
    {
        $this->concursosRepository->delete($concurso);
    }
}
