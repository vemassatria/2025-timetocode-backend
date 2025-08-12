<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ChallengeProgress extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'challenge_id',
        'level_id',
        'stars',
    ];

    /**
     * Get the user that owns the challenge progress.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}