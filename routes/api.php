<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\UserStatController;
use App\Http\Controllers\ChallengeProgressController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserStoryProgressController;

Route::apiResource('users', UserController::class);
Route::apiResource('user-stats', UserStatController::class);
Route::apiResource('user-story-progress', UserStoryProgressController::class);

Route::prefix('v1')->group(function () {
    Route::post('/users/{user}/challenge-progress', [ChallengeProgressController::class, 'store'])
        ->name('users.challenge-progress.store');

    Route::get('/users/{user}/challenge-progress/{progressId}', [ChallengeProgressController::class, 'show'])
        ->name('users.challenge-progress.show');
    // DELETE /api/v1/challenge-progress/{progress}
    Route::delete('/challenge-progress/{progress}', [ChallengeProgressController::class, 'destroy'])
        ->name('challenge-progress.destroy');
});