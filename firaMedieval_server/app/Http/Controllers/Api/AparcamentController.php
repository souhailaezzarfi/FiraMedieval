<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Aparcament;
use App\Models\ReservaAutocaravana;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AparcamentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $aparcaments = Aparcament::all();
        return response()->json($aparcaments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorizeAdmin();
        $request->validate(
            [
                'nom' => 'required|string|max:50|unique:aparcaments,nom',
                'aforament' => 'required|integer|min:1',
                'data_inici' => 'required|date',
                'data_final' => 'required|date|after:data_inici',
            ],
            [
                'nom.required' => 'El nom de la aparcament es obligatori.',
                'nom.max' => 'El nom de la apa$aparcament no pot superar els 50 caracters.',
                'nom.unique' => 'El nom de la aparcament ja existeix.',
                'aforament.integer' => 'El aforament ha de ser un nombre entero.',
                'aforament.min' => 'El aforament ha de ser almenys 1 plaza.',
                'data_inici.required' => 'La data d\'inici es obligatoria.',
            ]
        );
        $aparcament = Aparcament::create($request->all());
        return response()->json($aparcament, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $aparcament = Aparcament::findOrFail($id);
        return response()->json($aparcament);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $this->authorizeAdmin();
        $request->validate(
            [
                'nom' => 'sometimes|string|max:50|unique:aparcaments,nom,' . $id,
                'aforament' => 'sometimes|integer|min:1',
                'data_inici' => 'sometimes|date',
                'data_final' => 'sometimes|date',
            ],
            [
                'nom.max' => 'El nom de la aparcament no pot superar els 50 caracters.',
                'nom.unique' => 'El nom de la aparcament ja existeix.',
                'aforament.integer' => 'El aforament ha de ser un nombre entero.',
                'aforament.min' => 'El aforament ha de ser almenys 1 plaza.',
            ]
        );

        // lógica de fechas
        if ($request->has('data_inici') && $request->has('data_final')) {
            if ($request->data_final < $request->data_inici) {
                return response()->json([
                    'message' => 'La data final ha de ser posterior a la data d\'inici'
                ], 422);
            }
        }
        $aparcament = Aparcament::findOrFail($id);
        $aparcament->update($request->all());
        return response()->json($aparcament);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->authorizeAdmin();
        $aparcament = Aparcament::findOrFail($id);
        $aparcament->delete();
        return response()->json(['message' => 'Aparcament eliminada']);
    }

    public function actiu()
    {
        $aparcament = Aparcament::whereDate('data_inici', '<=', today())
            ->whereDate('data_final', '>=', today())
            ->first();

        if (!$aparcament) {
            return response()->json(['obert' => false]);
        }

        $ocupades = ReservaAutocaravana::where('aparcament_id', $aparcament->id)
            ->whereIn('estat', ['confirmada', 'espera'])
            ->count();

        return response()->json([
            'obert' => true,
            'aparcament' => $aparcament,
            'places_lliures' => max(0, $aparcament->aforament - $ocupades),
        ]);
    }

    private function authorizeAdmin()
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            abort(403, 'Només els administradors poden gestionar aparcaments.');
        }
    }
}
