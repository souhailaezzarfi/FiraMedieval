<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HorariActivitat;
use Illuminate\Http\Request;

class HorariActivitatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $horarisAvilitat = HorariActivitat::with('activitat')->get();
        return response()->json($horarisAvilitat);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate(
            [
                'activitat_id' => 'required|exists:activitats,id',
                'hora_inici' => 'required|date',
                'hora_final' => 'nullable|date|after:hora_inici',
            ],
            [
                'activitat_id.required' => 'L\'activitat es obligatoria.',
                'activitat_id.exists' => 'L\'activitat no existeix.',
                'hora_inici.required' => 'La hora d\'inici es obligatoria.',
                'hora_final.after' => 'La hora final ha de ser posterior a la hora d\'inici.',
            ]
        );

        $horari = HorariActivitat::create($request->all());
        return response()->json($horari, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return HorariActivitat::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        $request->validate([
            'activitat_id' => 'sometimes|exists:activitats,id',
            'hora_inici' => 'sometimes|date',
            'hora_final' => 'nullable|date',
        ], [
            'activitat_id.exists' => "L'activitat no existeix.",
        ]);

        if ($request->filled('hora_inici') && $request->filled('hora_final')) {
            if ($request->hora_final < $request->hora_inici) {
                return response()->json([
                    'message' => 'La hora final ha de ser posterior a la hora d\'inici'
                ], 422);
            }
        }

        $horariActivitat = HorariActivitat::find($id);

        $horariActivitat->update($request->all());

        return response()->json($horariActivitat);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $horariActivitat = HorariActivitat::findOrFail($id);
        $horariActivitat->delete();
        return response()->json($horariActivitat);
    }
}
