<?php

namespace App\Services;

use App\Models\Anotacao;
use App\Repositories\AnotacoesRepository;

class AnotacoesService
{
    public function __construct(
        private readonly AnotacoesRepository $anotacoesRepository
    ) {}

    public function findByTopicoForUser(int $topicoId, int $userId): ?Anotacao
    {
        return $this->anotacoesRepository->findByTopicoForUser($topicoId, $userId);
    }

    public function upsertForUser(int $userId, array $data): Anotacao
    {
        return $this->anotacoesRepository->upsertForUser($userId, $data);
    }
}
