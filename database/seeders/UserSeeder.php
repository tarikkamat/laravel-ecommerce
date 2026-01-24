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
        // Customer User
        User::factory()->create([
            'name' => 'Musteri Kullanici',
            'email' => 'customer@suug.istanbul',
            'role' => Role::CUSTOMER,
            'password' => Hash::make('password'),
        ]);

        // Admin User
        User::factory()->create([
            'name' => 'Yonetici Kullanici',
            'email' => 'admin@suug.istanbul',
            'role' => Role::ADMIN,
            'password' => Hash::make('password'),
        ]);
    }
}
