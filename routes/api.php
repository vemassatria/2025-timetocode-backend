<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\UserStatController;
use App\Http\Controllers\ChallengeProgressController;

Route::apiResource('users', UserController::class);
Route::apiResource('user-stats', UserStatController::class);

Route::prefix('v1')->group(function () {
    // POST /api/v1/users/{user}/challenge-progress
    Route::post('/users/{user}/challenge-progress', [ChallengeProgressController::class, 'store'])
        ->name('users.challenge-progress.store');
    // GET /api/v1/users/{user}/challenge-progress/{progressId}
    Route::get('/users/{user}/challenge-progress/{progressId}', [ChallengeProgressController::class, 'show'])
        ->name('users.challenge-progress.show');
});
