<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Inscripcio;
use App\Models\Activitat;

class InscripcioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user) return response()->json(['message' => 'No autoritzat'], 401);

        // Admin => ve todo
        if ($user->role === 'admin') {
            return Inscripcio::with(['activitat', 'user'])->get();
        }

        // Usuario normal => solo sus inscripciones
        return Inscripcio::with('activitat')
            ->where('user_id', Auth::id())
            ->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'activitat_id' => 'required|exists:activitats,id',
        ]);

        // Comprobar si ya está inscrito
        $jaInscrit = Inscripcio::where('activitat_id', $request->activitat_id)
            ->where('user_id', Auth::id())
            ->exists();

        if ($jaInscrit) {
            return response()->json(['message' => 'Ja estàs inscrit a aquesta activitat'], 409);
        }

        // Comprobar si hay plazas disponibles
        $activitat = Activitat::findOrFail($request->activitat_id);
        $inscrits = Inscripcio::where('activitat_id', $request->activitat_id)
            ->where('estat', 'confirmada')
            ->count();

        $estat = ($activitat->aforament && $inscrits >= $activitat->aforament) ? 'espera' : 'confirmada';

        $inscripcio = Inscripcio::create([
            'activitat_id' => $request->activitat_id,
            'user_id' => Auth::id(),
            'estat' => $estat,
        ]);

        return response()->json($inscripcio, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $inscripcio = Inscripcio::with('activitat')->findOrFail($id);


        if (Auth::user()->role !== 'admin' && $inscripcio->user_id !== Auth::id()) {
            return response()->json(['message' => 'No tens permís'], 403);
        }

        return response()->json($inscripcio);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();

        // Solo admin
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'No autoritzat'], 403);
        }

        $request->validate([
            'estat' => 'required|in:confirmada,espera,cancel·lada'
        ]);

        $inscripcio = Inscripcio::findOrFail($id);

        $inscripcio->update([
            'estat' => $request->estat
        ]);

        return response()->json($inscripcio);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();

        $inscripcio = Inscripcio::findOrFail($id);

        // Si es admin => puede borrar cualquiera
        if ($user->role === 'admin') {
            $inscripcio->delete();
            return response()->json(['message' => 'Inscripció cancel·lada']);
        }

        // Usuario normal => solo puede borrar la suya
        if ($inscripcio->user_id !== $user->id) {
            return response()->json(['message' => 'No autoritzat'], 403);
        }

        $inscripcio->delete();

        // Si se ha liberado una plaza al cancelar esta inscripción
        // buscamos al primer usuario que estaba en lista de espera para esa actividad
        $espera = Inscripcio::where('activitat_id', $inscripcio->activitat_id)
            ->where('estat', 'espera')
            ->orderBy('created_at', 'asc')
            ->first();

        if ($espera) {
            $espera->update(['estat' => 'confirmada']);
        }

        return response()->json(['message' => 'Inscripció cancel·lada']);
    }
}
