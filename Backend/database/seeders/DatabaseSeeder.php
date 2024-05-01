<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
        ]);

        Role::factory()->create([
            'name' => 'Others'
        ]);

        User::factory()->create([
            'name' => 'Revenue Hub',
            'email' => 'admin@revenuehub.com',
            'phone' => '+23408000254',
            'password' => Hash::make('12345678'),
            'role_id' => 1,
            'zone' => 'Abuja'
        ]);

        User::factory(3)->create();
    }
}
