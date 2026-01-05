<?php

use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('seeds two users', function () {
    $this->seed(UserSeeder::class);

    expect(User::count())->toBe(2);

    expect(User::query()->orderBy('email')->pluck('email')->all())->toBe([
        'admin@example.com',
        'test@example.com',
    ]);
});
