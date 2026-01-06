<?php

namespace App\Services;

use App\Models\Topico;
use App\Repositories\TopicosRepository;

class TopicosService
{
    public function __construct(
        private readonly TopicosRepository $topicosRepository
    ) {}

    public function listByDisciplinaForUser(int $disciplinaId, int $userId)
    {
        return $this->topicosRepository->listByDisciplinaForUser($disciplinaId, $userId);
    }

    public function create(array $data): Topico
    {
        if (! array_key_exists('ordem', $data) || $data['ordem'] === null) {
            $data['ordem'] = $this->topicosRepository->getNextOrdemForDisciplina($data['disciplina_id']);
        }

        return $this->topicosRepository->create($data);
    }

    public function findWithProgressForUser(int $topicoId, int $userId)
    {
        return $this->topicosRepository->findWithProgressForUser($topicoId, $userId);
    }
}
