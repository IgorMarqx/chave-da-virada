<?php

namespace App\Services;

use App\Models\Topico;
use App\Repositories\TopicosRepository;
use Illuminate\Database\Eloquent\Collection;

class TopicosService
{
    public function __construct(
        private readonly TopicosRepository $topicosRepository
    ) {}

    public function listByDisciplinaForUser(int $disciplinaId, int $userId): Collection
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

    public function findWithProgressForUser(int $topicoId, int $userId): ?Topico
    {
        return $this->topicosRepository->findWithProgressForUser($topicoId, $userId);
    }

    public function update(Topico $topico, array $data): Topico
    {
        return $this->topicosRepository->update($topico, $data);
    }

    public function delete(Topico $topico): void
    {
        $this->topicosRepository->delete($topico);
    }

    /**
     * @param  array<int, int>  $topicoIds
     */
    public function reorderForUser(int $disciplinaId, int $userId, array $topicoIds): Collection
    {
        $this->topicosRepository->reorderForUser($disciplinaId, $userId, $topicoIds);

        return $this->topicosRepository->listByDisciplinaForUser($disciplinaId, $userId);
    }
}
