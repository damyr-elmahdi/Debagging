<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        // Retrieve all users with pagination
        $users = User::paginate(10);
        return response()->json([
            'users' => $users
        ]);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json([
            'user' => $user
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $fields = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|in:client,admin',
        ]);
        
        $user->update($fields);
        
        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }
    
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        
        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }
    
    public function stats()
    {
        return response()->json([
            'totalUsers' => User::count(),
            'adminUsers' => User::where('role', 'admin')->count(),
            'clientUsers' => User::where('role', 'client')->count(),
            'recentUsers' => User::orderBy('created_at', 'desc')->take(5)->get()
        ]);
    }
}