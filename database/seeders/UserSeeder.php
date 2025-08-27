<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
        User::updateOrCreate([
            'name' => 'John Doe',
            'email' => 'johndoe@example.com',
            'password' => Hash::make('password'),
        ]);

        User::updateOrCreate([
            'name' => 'Alice Example',
            'email' => 'alice@example.com',
            'password' => Hash::make('password'),
        ]);

        User::updateOrCreate([
            'name' => 'Bob Sample',
            'email' => 'bob@example.com',
            'password' => Hash::make('password'),
        ]);
    }
}
