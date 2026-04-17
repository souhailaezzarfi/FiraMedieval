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
    public function index(Request $request)
    {
        $user = Auth::user();


        $query = Inscripcio::with(['activitat']);
        if ($user->role === 'admin') {
            $query->with('user');
        }

        // Si el frontend envía un 'activitat_id', filtramos la lista para que solo devuelva los inscritos en esa actividad concreta

        if ($request->filled('activitat_id')) {
            $query->where('activitat_id', $request->activitat_id);
        }

        // el usuario solo vea sus propias inscripciones

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        return $query->get();
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

        return response()->json([
            'inscripcio' => $inscripcio,
            'message' => $estat === 'espera' ? 'Inscrit a la llista d\'espera' : 'Inscripció confirmada'
        ], 201);
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
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        $inscripcio = Inscripcio::findOrFail($id);

        // Seguridad
        if ($user->role !== 'admin' && $inscripcio->user_id !== $user->id) {
            return response()->json(['message' => 'No autoritzat'], 403);
        }

        // Evitar doble cancelación
        if ($inscripcio->estat === 'cancel·lada') {
            return response()->json(['message' => 'Ja està cancel·lada'], 422);
        }

        $estatPrevi = $inscripcio->estat;

        // NO BORRAR, solo cambiar estado
        $inscripcio->update(['estat' => 'cancel·lada']);

        // Si liberamos plaza
        if ($estatPrevi === 'confirmada') {
            $espera = Inscripcio::where('activitat_id', $inscripcio->activitat_id)
                ->where('estat', 'espera')
                ->orderBy('created_at', 'asc')
                ->first();

            if ($espera) {
                $espera->update(['estat' => 'confirmada']);
            }
        }

        return response()->json(['message' => 'Inscripció cancel·lada']);
    }
}
