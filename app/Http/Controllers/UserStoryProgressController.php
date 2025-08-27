<?php

namespace App\Http\Controllers;

use App\Models\UserStoryProgress;
use Illuminate\Http\Request;

class UserStoryProgressController extends Controller
{
    public function index()
    {
        return UserStoryProgress::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'story_level_id' => 'required|integer',
            'status' => 'required|in:in-progress,completed',
            'score' => 'nullable|integer',
            'last_played_at' => 'nullable|date',
        ]);

        $progress = UserStoryProgress::create($validated);

        return response()->json($progress, 201);
    }

    public function show(string $id)
    {
        return UserStoryProgress::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $progress = UserStoryProgress::findOrFail($id);

        $validated = $request->validate([
            'story_level_id' => 'sometimes|integer',
            'status' => 'sometimes|in:in-progress,completed',
            'score' => 'nullable|integer',
            'last_played_at' => 'nullable|date',
        ]);

        $progress->update($validated);

        return response()->json($progress);
    }

    public function destroy(string $id)
    {
        $progress = UserStoryProgress::findOrFail($id);
        $progress->delete();

        return response()->json(['message' => 'UserStoryProgress deleted']);
    }
}