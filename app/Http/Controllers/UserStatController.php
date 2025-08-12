<?php

namespace App\Http\Controllers;

use App\Models\UserStat;
use Illuminate\Http\Request;

class UserStatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
      return UserStat::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'           => 'required|exists:users,id',
            'total_xp'          => 'required|integer',
            'level'             => 'required|integer',
            'total_time_spent'  => 'required|integer',
        ]);

        $userStat = UserStat::create($validated);

        return response()->json($userStat, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $userStat = UserStat::findOrFail($id);
        return $userStat;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $userStat = UserStat::findOrFail($id);

        $validated = $request->validate([
            'total_xp'          => 'sometimes|integer',
            'level'             => 'sometimes|integer',
            'total_time_spent'  => 'sometimes|integer',
        ]);

        $userStat->update($validated);

        return response()->json($userStat);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $userStat = UserStat::findOrFail($id);
        $userStat->delete();

        return response()->json(['message' => 'UserStat deleted']);

    }
}
