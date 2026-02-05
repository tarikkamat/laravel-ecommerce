<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'Yonetici Kullanici',
            'email' => 'admin@suug.istanbul',
            'role' => Role::ADMIN,
            'password' => Hash::make('Huseyin@suug123'),
        ]);
    }
}
