<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'igor@gmail.com'],
            [
                'name' => 'Igor Marques',
                'password' => Hash::make('12345'),
                'phone' => '83986531492',
                'cpf' => '12489723413',
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'user@gmail.com'],
            [
                'name' => 'user',
                'password' => Hash::make('password'),
                'phone' => '83999999999',
                'cpf' => '12345678901',
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );
    }
}
