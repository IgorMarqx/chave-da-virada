<?php

namespace App\Services;

use App\Repositories\UsersRepository;
use App\Models\User;
use Illuminate\Support\Str;

class UsersService
{
    public function __construct(
        private readonly UsersRepository $usersRepository
    ) {}

    public function listAll()
    {
        return $this->usersRepository->listAll();
    }

    public function create(array $data): User
    {
        if (!isset($data['password'])) {
            $data['password'] = Str::random(12);
        }

        return $this->usersRepository->create($data);
    }

    public function update(User $user, array $data): User
    {
        return $this->usersRepository->update($user, $data);
    }

    public function delete(User $user): void
    {
        $this->usersRepository->delete($user);
    }
}
