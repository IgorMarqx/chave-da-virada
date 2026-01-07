<?php

namespace App\Services;

use App\Repositories\UsersRepository;
use App\Models\User;
use App\Jobs\SentLoginToUser;
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
        $plainPassword = $data['password'] ?? Str::random(12);
        $data['password'] = $plainPassword;

        $user = $this->usersRepository->create($data);

        if (!empty($user->phone)) {
            SentLoginToUser::dispatch(
                $user->phone,
                $user->name,
                $user->email,
                $plainPassword
            );
        }

        return $user;
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
