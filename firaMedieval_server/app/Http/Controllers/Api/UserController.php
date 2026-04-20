<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            return response()->json(User::all());
        }

        return response()->json(['message' => 'No autoritzat'], 403);
    }

    /**
     * Display the authenticated user
     * Devuelve el usuario actualmente logueado mediante el token
    */

    public function me()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'No autenticat'], 401);
        }

        return response()->json($user);
    }

    /**
     * Store a newly created resource in storage.
     */


    public function store(Request $request)
    {

        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'No autoritzat'], 403);
        }

        $request->validate([
            'nom' => 'required|string|max:100',
            'cognoms' => 'required|string|max:150',
            'telefon' => 'required|string|max:20',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'nom.required' => 'El nom es obligatori.',
            'nom.max' => 'El nom no pot superar els 100 caracters.',
            'cognoms.required' => 'Els cognoms son obligatoris.',
            'cognoms.max' => 'Els cognoms no pot superar els 150 caracters.',
            'telefon.required' => 'El telefon es obligatori.',
            'telefon.max' => 'El telefon no pot superar els 20 caracters.',
            'email.required' => 'L\'email es obligatori.',
            'email.max' => 'L\'email no pot superar els 255 caracters.',
            'email.unique' => 'L\'email ja existeix.',
            'password.required' => 'La contrasenya es obligatoria.',
            'password.min' => 'La contrasenya ha de tenir almenys 8 caracters.',
            'password.confirmed' => 'La contrasenya no coincideix.',
        ]);

        $data = $request->only([
            'nom',
            'cognoms',
            'telefon',
            'email',
            'password'
        ]);

        $data['password'] = Hash::make($request->password);
        $data['role'] = 'admin';

        $user = User::create($data);

        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user();

        if ($user->role !== 'admin' && $user->id !== (int)$id) {
            return response()->json(['message' => 'No autoritzat'], 403);
        }

        return User::with(['reservaAutocaravana', 'inscripcionsActivitats'])->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Buscamos el usuario que queremos editar
        $userUpdate = User::findOrFail($id);
        $user = Auth::user();

        // Seguridad: Solo admin o el propio usuario puede editar
        if ($user->role !== 'admin' && $userUpdate->id !== Auth::id()) {
            return response()->json(['message' => 'No autoritzat'], 403);
        }

        // Validación
        $request->validate([
            'nom' => 'sometimes|required|string|max:100',
            'cognoms' => 'sometimes|required|string|max:150',
            'telefon' => 'sometimes|required|string|max:20',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|required|string|min:8|confirmed',
        ], [
            'nom.required' => 'El nom és obligatori.',
            'nom.max' => 'El nom no pot superar els 100 caràcters.',
            'cognoms.required' => 'Els cognoms són obligatoris.',
            'cognoms.max' => 'Els cognoms no poden superar els 150 caràcters.',
            'telefon.required' => 'El telèfon és obligatori.',
            'telefon.max' => 'El telèfon no pot superar els 20 caràcters.',
            'email.required' => 'L\'email és obligatori.',
            'email.max' => 'L\'email no pot superar els 255 caràcters.',
            'email.unique' => 'L\'email ja existeix.',
            'password.required' => 'La contrasenya és obligatòria.',
            'password.min' => 'La contrasenya ha de tenir almenys 8 caràcters.',
            'password.confirmed' => 'La contrasenya no coincideix.',
        ]);

        $data = $request->only([
            'nom',
            'cognoms',
            'telefon',
            'email',
            'password'
        ]);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        // ACTUALIZAMOS
        $userUpdate->update($data);

        return response()->json($userUpdate);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {

        $user = Auth::user();
        $usuari = User::findOrFail($id);

        if ($user->role !== 'admin' && $usuari->id !== $user->id) {
            return response()->json(['message' => 'No autoritzat'], 403);
        }

        // PROTECCIÓN: evitar quedarse sin admins
        if ($usuari->role === 'admin') {
            $totalAdmins = User::where('role', 'admin')->count();

            if ($totalAdmins <= 1) {
                return response()->json([
                    'message' => 'No es pot eliminar l\'últim administrador'
                ], 403);
            }
        }

        $usuari->delete();

        return response()->json(['message' => 'Usuari eliminat correctament'], 200);
    }
}
