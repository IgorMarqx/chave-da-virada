<?php

namespace App\Repositories;

use App\Models\User;

class UsersRepository
{
    public function listAll()
    {
        return User::query()
            ->select('id', 'name', 'email', 'phone', 'role', 'is_active', 'created_at', 'updated_at')
            ->orderBy('name')
            ->get();
    }

    public function create(array $data): User
    {
        return User::query()->create($data);
    }

    public function update(User $user, array $data): User
    {
        $user->fill($data);
        $user->save();

        return $user;
    }

    public function delete(User $user): void
    {
        $user->delete();
    }
}
