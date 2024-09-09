<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\CadastralZone;
use App\Models\Category;
use App\Models\Group;
use App\Models\NibssKeys;
use App\Models\OfficeZone;
use App\Models\Property;
use App\Models\PropertyType;
use App\Models\PropertyUse;
use App\Models\RatingDistrict;
use App\Models\Role;
use App\Models\Street;
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

        $data = [
            'AES_IV' => "8aa9149ae7020648",
            'SECRET_KEY' => "OJta0qzFaPCW8WZLzrmsCHJL48qWsuZn",
        ];

        foreach ($data as $keyName => $key) {
            NibssKeys::create([
                'key_name' => $keyName,
                'key' => $key,
            ]);
        }



        User::factory(3)->create();
        OfficeZone::factory(10)->create();
        RatingDistrict::factory(3)->create();
        CadastralZone::factory(2)->create();
        Street::factory(2)->create();
        PropertyType::factory(2)->create();
        PropertyUse::factory(2)->create();
        Category::factory(2)->create();
        Group::factory(2)->create();
        Property::factory(10)->create();
    }
}
