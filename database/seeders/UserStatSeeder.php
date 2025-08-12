<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserStat;

class UserStatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            UserStat::create([
                'user_id' => $user->id,
                'total_xp' => rand(0, 1000),
                'level' => rand(1, 10),
                'total_time_spent' => rand(100, 5000),
                'last_active_at' => now()->subDays(rand(0, 30)),
            ]);
        }
    }
}
