<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserStat extends Model
{
    protected $fillable = [
        'user_id',
        'total_xp',
        'level',
        'total_time_spent',
    ];
}
