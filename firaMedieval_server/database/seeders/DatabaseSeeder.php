<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'nom' => 'Admin',
            'cognoms' => 'Principal',
            'email' => 'admin@fira.com',
            'password' => bcrypt('admin1234'),
            'telefon' => '600000000',
            'role' => 'admin',
        ]);

        $this->call([
            ActivitatsSeeder::class,
        ]);
    }
}
