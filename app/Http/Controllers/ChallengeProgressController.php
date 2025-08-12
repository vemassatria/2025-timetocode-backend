<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChallengeProgressResource;
use App\Models\ChallengeProgress;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class ChallengeProgressController extends Controller
{
    /**
     * Store a newly created or update an existing resource in storage.
     * POST /api/v1/users/{user}/challenge-progress
     */
    public function store(Request $request, User $user): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'challenge_id' => 'required|integer',
            'level_id'     => 'required|integer',
            'stars'        => 'required|integer|min:1|max:3',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        // "Upsert" logic: Update if exists, or create if not.
        $progress = ChallengeProgress::updateOrCreate(
            [
                'user_id'      => $user->id,
                'challenge_id' => $validated['challenge_id'],
                'level_id'     => $validated['level_id'],
            ],
            [
                'stars' => $validated['stars'],
            ]
        );

        $message = $progress->wasRecentlyCreated ? 'Progress created successfully' : 'Progress updated successfully';

        return response()->json([
            'message' => $message,
            'data'    => new ChallengeProgressResource($progress)
        ], $progress->wasRecentlyCreated ? 201 : 200);
    }

    public function show(User $user, ChallengeProgress $progress): JsonResponse
    {
        if ($progress->user_id !== $user->id) {
            return response()->json([
                'message' => 'Challenge progress not found for this user',
            ], 404);
        }

        return response()->json([
            'message' => 'Challenge progress retrieved successfully',
            'data'    => new ChallengeProgressResource($progress),
        ]);
    }

}
