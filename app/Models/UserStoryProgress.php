<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserStoryProgress extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'story_level_id',
        'status',
        'score',
        'last_played_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
