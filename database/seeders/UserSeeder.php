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
        User::create([
            'name' => 'John Doe',
            'email' => 'johndoe@example.com',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'Alice Example',
            'email' => 'alice@example.com',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'Bob Sample',
            'email' => 'bob@example.com',
            'password' => Hash::make('password'),
        ]);
    }
}
