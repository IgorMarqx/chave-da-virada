<?php

namespace App\Services;

use App\Models\Disciplina;
use App\Repositories\DisciplinasRepository;
use Illuminate\Database\Eloquent\Collection;

class DisciplinasService
{
    public function __construct(
        private readonly DisciplinasRepository $disciplinasRepository
    ) {}

    public function create(array $data): Disciplina
    {
        return $this->disciplinasRepository->create($data);
    }

    public function listByConcursoForUser(int $concursoId, int $userId): Collection
    {
        return $this->disciplinasRepository->listByConcursoForUser($concursoId, $userId);
    }

    public function listRecentForUser(int $userId, int $limit = 3): Collection
    {
        return $this->disciplinasRepository->listRecentForUser($userId, $limit);
    }

    public function update(Disciplina $disciplina, array $data): Disciplina
    {
        return $this->disciplinasRepository->update($disciplina, $data);
    }

    public function delete(Disciplina $disciplina): void
    {
        $this->disciplinasRepository->delete($disciplina);
    }
}
