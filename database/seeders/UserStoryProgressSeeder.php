<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserStoryProgressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\UserStoryProgress::create([
        'user_id' => 1,
        'story_level_id' => 3,
        'status' => 'completed',
        'score' => 95,
        'last_played_at' => now(),
    ]);
    }
}
