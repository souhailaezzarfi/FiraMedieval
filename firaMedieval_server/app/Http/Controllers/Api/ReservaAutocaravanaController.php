<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ReservaAutocaravana;
use App\Models\Aparcament;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReservaAutocaravanaController extends Controller
{
    /**
     * Llistar les reserves de places d'aparcament
     * L'administrador les veu totes, l'usuari només les seves
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->role == 'admin') {
            $reserves = ReservaAutocaravana::with(['aparcament', 'usuari'])->get();
            return response()->json($reserves);
        }

        $reserves = ReservaAutocaravana::with('aparcament')
            ->where('user_id', Auth::id())
            ->get();

        return response()->json($reserves);
    }

    /**
     * Crear una nova reserva
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // L'administrador no pot crear reserves
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Els administradors no poden crear reserves.'], 403);
        }

        $request->validate([
            'aparcament_id' => 'required|exists:aparcaments,id',
            'marca_vehicle' => 'required|string',
            'model_vehicle' => 'required|string',
            'matricula' => 'required|string',
            'procedencia' => 'required|string',
            'total_persones' => 'required|integer|min:1',
            'data_arribada' => 'required|date|after_or_equal:today',
            'data_sortida' => 'required|date|after_or_equal:data_arribada',
        ], [
            'matricula.required' => 'La matrícula és obligatòria.',
            'data_arribada.after_or_equal' => 'La data d\'arribada ha de ser igual o posterior a la data actual.',
            'data_sortida.after' => 'La data de sortida ha de ser posterior a la data d\'arribada.',
        ]);

        // Comprovar si l'usuari ja té una reserva activa (ignorant les cancel·lades)
        if (ReservaAutocaravana::where('user_id', $user->id)->where('estat', '!=', 'cancel·lada')->exists()) {
            return response()->json(['message' => 'Ja tens una reserva activa. Només es permet una reserva d\'aparcament per usuari.'], 409);
        }

        // Comprovar si hi ha places disponibles a l'aparcament
        $aparcament = Aparcament::findOrFail($request->aparcament_id);

        if ($request->data_arribada < $aparcament->data_inici || $request->data_sortida > $aparcament->data_final) {
            return response()->json([
                'message' => 'Les dates han d\'estar dins del període de l\'aparcament.'
            ], 422);
        }

        $ocupades = ReservaAutocaravana::where('aparcament_id', $request->aparcament_id)
            ->where('estat', 'confirmada')
            ->count();

        // Assignació d'estat de la reserva
        if ($ocupades >= $aparcament->aforament) {
            $estat = 'espera';
        } else {
            $estat = 'confirmada';
        }

        // Crear la reserva
        $reserva = ReservaAutocaravana::create([
            'aparcament_id' => $request->aparcament_id,
            'user_id' => $user->id,
            'marca_vehicle' => $request->marca_vehicle,
            'model_vehicle' => $request->model_vehicle,
            'matricula' => $request->matricula,
            'procedencia' => $request->procedencia,
            'total_persones' => $request->total_persones,
            'data_arribada' => $request->data_arribada,
            'data_sortida' => $request->data_sortida,
            'estat' => $estat,
        ]);

        return response()->json($reserva, 201);
    }

    /**
     * Mostrar els detalls d'una reserva concreta
     */
    public function show(string $id)
    {
        $reserva = ReservaAutocaravana::with('aparcament')->findOrFail($id);

        // Validació de seguretat: només l'administrador o el propietari poden veure-la
        if (Auth::user()->role != 'admin' && $reserva->user_id !== Auth::id()) {
            return response()->json(['message' => 'No tens permís per veure aquesta reserva'], 403);
        }

        return response()->json($reserva);
    }

    /**
     * Actualitzar una reserva
     */

    public function update(Request $request, string $id)
    {
        $user = Auth::user();
        $reserva = ReservaAutocaravana::findOrFail($id);

        // Només el propietari pot editar la seva reserva
        if ($reserva->user_id !== $user->id) {
            return response()->json(['message' => 'No autoritzat'], 403);
        }

        // No es pot editar una reserva cancel·lada
        if ($reserva->estat === 'cancel·lada') {
            return response()->json(['message' => 'No es pot editar una reserva cancel·lada.'], 422);
        }

        $request->validate([
            'marca_vehicle' => 'sometimes|string',
            'model_vehicle' => 'sometimes|string',
            'matricula'     => 'sometimes|string',
            'procedencia'   => 'sometimes|string',
            'total_persones' => 'sometimes|integer|min:1',
            'data_arribada' => 'sometimes|date',
            'data_sortida'  => 'sometimes|date|after_or_equal:data_arribada',
        ]);

        $reserva->update($request->only([
            'marca_vehicle',
            'model_vehicle',
            'matricula',
            'procedencia',
            'total_persones',
            'data_arribada',
            'data_sortida'
        ]));

        return response()->json($reserva);
    }

    /**
     * Eliminar (cancel·lar) una reserva
     */
    public function cancel(string $id)
    {
        $user = Auth::user();
        $reserva = ReservaAutocaravana::findOrFail($id);

        // L'usuari normal només pot esborrar la seva pròpia reserva
        if ($user->role != 'admin' && $reserva->user_id != $user->id) {
            return response()->json(['message' => 'No autoritzat'], 403);
        }

        // Si ja està cancel·lada, eliminar del tot
        if ($reserva->estat === 'cancel·lada') {
            if ($user->role !== 'admin') {
                return response()->json(['message' => 'No autoritzat'], 403);
            }
            $reserva->delete();
            return response()->json(['message' => 'Reserva eliminada']);
        }

        $estatPrevi = $reserva->estat;
        $reserva->update(['estat' => 'cancel·lada']);

        if ($estatPrevi == 'confirmada') {
            $this->actualitzarLlistaEspera($reserva->aparcament_id);
        }

        return response()->json(['message' => 'Reserva cancel·lada correctament'], 200);
    }

    /**
     * Eliminar totes les reserves cancel·lades
     */

    public function destroyCancelades()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'No autoritzat'], 403);
        }

        $count = ReservaAutocaravana::where('estat', 'cancel·lada')->delete();
        return response()->json(['message' => "$count reserves eliminades"]);
    }
    /**
     * Funció per actualitzar la llista d'espera
     */
    private function actualitzarLlistaEspera($aparcament_id)
    {
        $seguentReserva = ReservaAutocaravana::where('aparcament_id', $aparcament_id)
            ->where('estat', 'espera')
            ->orderBy('created_at', 'asc')
            ->first();

        if ($seguentReserva) {
            $seguentReserva->update(['estat' => 'confirmada']);
        }
    }
}
