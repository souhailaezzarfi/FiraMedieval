<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ReservaAutocaravana;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class ReservaAutocaravanaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        // Admin => ve todo
        if ($user->role === 'admin') {
            $reservas = ReservaAutocaravana::with(['aparcament', 'user'])->get();
            return response()->json($reservas);
        }

        // Usuario normal => solo sus inscripciones
        $reservas = ReservaAutocaravana::with('aparcament')
            ->where('user_id', Auth::id())
            ->get();

        return response()->json($reservas);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'aparcament_id' => 'required|exists:aparcaments,id',
            'marca_vehicle' => 'required|string',
            'model_vehicle' => 'required|string',
            'matricula' => 'required|string',
            'procedencia' => 'required|string',
            'total_persones' => 'required|integer|min:1',
            'data_arribada' => 'required|date|after_or_equal:today',
            'data_sortida' => 'required|date|after:data_arribada',
        ]);

        // Comprobar si ya tiene reserva
        $reserva = ReservaAutocaravana::where('aparcament_id', $request->aparcament_id)
            ->where('user_id', Auth::id())
            ->exists();

        if ($reserva) {
            return response()->json(['message' => 'Ja téns una reserva a aquest aparcament'], 409);
        }

        // Comprobar si hay plazas disponibles
        $aparcament = ReservaAutocaravana::findOrFail($request->aparcament_id);

        $ocupades = ReservaAutocaravana::where('aparcament_id', $request->aparcament_id)
            ->where('estat', 'confirmada')
            ->count();

        if ($ocupades >= $aparcament->aforament) {
            $estat = 'espera'; // si mantienes lista de espera
        } else {
            $estat = 'confirmada';
        }

        $reserva = ReservaAutocaravana::create([
            'aparcament_id' => $request->aparcament_id,
            'user_id' => Auth::id(),
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
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $reserva = ReservaAutocaravana::with('aparcament')->findOrFail($id);

        if (Auth::user()->role !== 'admin' && $reserva->user_id !== Auth::id()) {
            return response()->json(['message' => 'No tens permís'], 403);
        }

        return response()->json($reserva);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $reserva = ReservaAutocaravana::findOrFail($id);
        $user = Auth::user();

        // Seguridad: Solo el dueño puede editar su reserva. El Admin puede editar cualquiera.
        if ($user->role !== 'admin' && $reserva->user_id !== $user->id) {
            return response()->json(['message' => 'No autoritzat'], 403);
        }

        // Validación (siempre necesaria)
        $request->validate([
            'marca_vehicle' => 'sometimes|string',
            'model_vehicle' => 'sometimes|string',
            'matricula' => 'sometimes|string',
            'procedencia' => 'sometimes|string',
            'total_persones' => 'sometimes|integer|min:1',
            'data_arribada' => 'sometimes|date',
            'data_sortida' => 'sometimes|date|after:data_arribada',
            'estat' => 'sometimes|in:confirmada,espera,cancel·lada', // Solo si es admin
        ]);

        // Lógica de edición
        // Campos que TODOS pueden editar
        $datosAActualizar = $request->only([
            'marca_vehicle',
            'model_vehicle',
            'matricula',
            'procedencia',
            'total_persones',
            'data_arribada',
            'data_sortida'
        ]);

        // Lógica especial para el Admin: Si el Admin envía un estado nuevo, se guarda
        if ($user->role === 'admin' && $request->has('estat')) {
            $datosAActualizar['estat'] = $request->estat;
        }

       
        $reserva->update($datosAActualizar);

        return response()->json($reserva);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();

        $reserva = ReservaAutocaravana::findOrFail($id);

        // Si es admin => puede borrar cualquiera
        if ($user->role === 'admin') {
            $reserva->delete();
            return response()->json(['message' => 'Reserva cancel·lada']);
        }

        // Usuario normal => solo puede borrar la suya
        if ($reserva->user_id !== $user->id) {
            return response()->json(['message' => 'No autoritzat'], 403);
        }

        $reserva->delete();

        // Si se ha liberado una plaza al cancelar esta reserva, 
        // buscamos al primer usuario que estaba en lista de espera para ese aparcament
        $siguienteEnEspera = ReservaAutocaravana::where('aparcament_id', $reserva->aparcament_id)
            ->where('estat', 'espera')
            ->orderBy('created_at', 'asc')
            ->first();

        if ($siguienteEnEspera) {
            $siguienteEnEspera->update(['estat' => 'confirmada']);
        }

        return response()->json(['message' => 'Reserva cancel·lada']);
    }
}
