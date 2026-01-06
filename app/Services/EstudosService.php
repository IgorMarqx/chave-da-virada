<?php

namespace App\Services;

use App\Models\Estudo;
use App\Repositories\EstudosRepository;

class EstudosService
{
    public function __construct(
        private readonly EstudosRepository $estudosRepository
    ) {}

    public function listByTopicoForUser(int $topicoId, int $userId)
    {
        return $this->estudosRepository->listByTopicoForUser($topicoId, $userId);
    }

    public function createForUser(int $userId, array $data): Estudo
    {
        $estudo = $this->estudosRepository->createForUser($userId, $data);
        $this->estudosRepository->upsertTopicoProgresso($userId, $data['topico_id']);

        return $estudo;
    }
}
