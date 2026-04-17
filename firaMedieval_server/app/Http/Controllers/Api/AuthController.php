<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Registre d'un nou usuari
     */
    public function register(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:100',
            'cognoms' => 'required|string|max:150',
            'telefon' => 'required|string|max:20',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'nom' => $request->nom,
            'cognoms' => $request->cognoms,
            'telefon' => $request->telefon,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'usuari',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuari creat correctament',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    /**
     * Login d'un usuari existent
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Credencials incorrectes'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login correcte',
            'user' => $user,
            'token' => $token
        ]);
    }

    /**
     * Tancar sessió
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sessió tancada correctament']);
    }
}
