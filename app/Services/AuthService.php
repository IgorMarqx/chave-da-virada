<?php

namespace App\Services;

use App\Repositories\AuthRepository;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private readonly AuthRepository $authRepository
    ) {}

    public function login(string $email, string $password): array
    {
        $user = $this->authRepository->findByEmail($email);

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['Credenciais invalidas.'],
            ]);
        }

        $token = auth('api')->attempt([
            'email' => $email,
            'password' => $password,
        ]);

        if (! $token) {
            throw ValidationException::withMessages([
                'email' => ['Credenciais invalidas.'],
            ]);
        }

        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => auth('api')->user(),
            'must_reset_password' => (bool) auth('api')->user()?->must_reset_password,
        ];
    }
}
