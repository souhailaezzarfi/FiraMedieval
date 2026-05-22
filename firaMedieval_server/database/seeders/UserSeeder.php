<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Usuari administrador
        User::create([
            'nom' => 'Admin',
            'cognoms' => 'Fira',
            'telefon' => '600123456',
            'email' => 'admin@fira.com',
            'password' => Hash::make('admin1234'),
            'role' => 'admin',
        ]);

        // Usuari normal
        User::create([
            'nom' => 'Arià',
            'cognoms' => 'Aragón',
            'telefon' => '600987654',
            'email' => 'usuari@fira.com',
            'password' => Hash::make('user1234'),
            'role' => 'usuari',
        ]);
    }
}