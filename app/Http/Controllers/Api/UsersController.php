<?php

namespace App\Http\Controllers\Api;

use App\Services\UsersService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UsersController extends ApiController
{
    public function __construct(
        private readonly UsersService $usersService
    ) {}

    public function index()
    {
        $users = $this->usersService->listAll();

        $payload = $users->map(function (User $user) {
            return [
                'id' => (string) $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'role' => $user->role ?? 'user',
                'status' => $user->is_active ? 'ativo' : 'inativo',
                'createdAt' => optional($user->created_at)->toDateString(),
                'lastAccess' => optional($user->updated_at)->toDateString(),
                'mustResetPassword' => (bool) $user->must_reset_password,
            ];
        });

        return $this->apiSuccess($payload, 'Users fetched successfully');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:30',
            'role' => [
                'required',
                'string',
                Rule::in(['admin', 'user']),
            ],
            'status' => ['required', 'string', Rule::in(['ativo', 'inativo'])],
            'password' => 'required|string|confirmed',
            'must_reset_password' => 'sometimes|boolean',
        ]);

        $user = $this->usersService->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'role' => $data['role'],
            'is_active' => $data['status'] === 'ativo',
            'password' => $data['password'],
            'must_reset_password' => $data['must_reset_password'] ?? false,
        ]);

        return $this->apiSuccess($user, 'User created successfully', 201);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => 'nullable|string|max:30',
            'role' => [
                'required',
                'string',
                Rule::in(['admin', 'user']),
            ],
            'status' => ['required', 'string', Rule::in(['ativo', 'inativo'])],
            'password' => 'nullable|string|min:8|confirmed',
            'must_reset_password' => 'sometimes|boolean',
        ]);

        $payload = [
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'role' => $data['role'],
            'is_active' => $data['status'] === 'ativo',
            'must_reset_password' => $data['must_reset_password'] ?? $user->must_reset_password,
        ];

        if (!empty($data['password'])) {
            $payload['password'] = $data['password'];
            $payload['last_password_reset_at'] = now();
            $payload['must_reset_password'] = false;
        }

        $updated = $this->usersService->update($user, $payload);

        return $this->apiSuccess($updated, 'User updated successfully');
    }

    public function destroy(User $user)
    {
        $this->usersService->delete($user);

        return $this->apiSuccess(null, 'User deleted successfully');
    }

    public function toggleStatus(User $user)
    {
        $updated = $this->usersService->update($user, [
            'is_active' => !$user->is_active,
        ]);

        return $this->apiSuccess($updated, 'User status updated successfully');
    }
}
