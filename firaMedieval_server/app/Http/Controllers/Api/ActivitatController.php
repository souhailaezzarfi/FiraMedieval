<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\Activitat;

class ActivitatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $activitats = Activitat::with('horaris')->get();

        foreach ($activitats as $activitat) {
            if ($activitat->imatge) {
                $activitat->imatge = asset('storage/' . $activitat->imatge);
            }
        }

        return response()->json($activitats);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validació de dades (incloent-hi els horaris)
        $request->validate(
            [
                'nom' => 'required|string|max:100',
                'organitzador' => 'required|string|max:100',
                'descripcio' => 'required|string',
                'ubicacio' => 'required|string|max:100',
                'aforament' => 'nullable|integer|min:1',
                'imatge' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'horaris' => 'nullable|array',
                'horaris.*.hora_inici' => 'required_with:horaris|date',
                'horaris.*.hora_final' => 'required_with:horaris|date|after:horaris.*.hora_inici',
            ],
            [
                'nom.required' => 'El nom de l\'activitat és obligatori.',
                'nom.max' => 'El nom no pot superar els 100 caràcters.',
                'organitzador.required' => 'Has d\'indicar qui organitza l\'activitat.',
                'descripcio.required' => 'La descripció és necessària per als assistents.',
                'ubicacio.required' => 'Has d\'indicar la ubicació de l\'activitat.',
                'aforament.integer' => 'L\'aforament ha de ser un nombre enter.',
                'aforament.min' => 'L\'aforament ha de ser d\'almenys 1 persona.',
                'imatge.image' => 'El fitxer ha de ser una imatge.',
                'imatge.max' => 'La imatge no pot pesar més de 2MB.',
                'horaris.*.hora_final.after' => 'L\'hora de finalització ha de ser posterior a la d\'inici.',
            ]
        );

        // 2. Transacció a la base de dades
        $activitat = DB::transaction(function () use ($request) {

            $activitat = new Activitat();
            $activitat->nom = $request->nom;
            $activitat->organitzador = $request->organitzador;
            $activitat->descripcio = $request->descripcio;
            $activitat->ubicacio = $request->ubicacio;
            $activitat->aforament = $request->aforament;

            if ($request->file('imatge')) {
                $path = $request->file('imatge')->store('imatges', 'public');
                $activitat->imatge = $path;
            }

            $activitat->save(); // Guardem l'activitat

            // Guardem els horaris vinculats (si n'hi ha)
            if ($request->has('horaris') && is_array($request->horaris)) {
                foreach ($request->horaris as $horariData) {
                    $activitat->horaris()->create([
                        'hora_inici' => $horariData['hora_inici'],
                        'hora_final' => $horariData['hora_final'],
                    ]);
                }
            }

            return $activitat; // Retornem l'objecte creat
        });


        return response()->json($activitat->load('horaris'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Afegim 'with' perquè retorni l'activitat junt amb els seus horaris
        $activitat = Activitat::with('horaris')->findOrFail($id);
        
        // Formatem l'enllaç de la imatge com a l'index
        if ($activitat->imatge) {
            $activitat->imatge = asset('storage/' . $activitat->imatge);
        }

        return response()->json($activitat);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $activitat = Activitat::findOrFail($id);

        $request->validate(
            [
                'nom' => 'sometimes|string|max:100',
                'organitzador' => 'sometimes|string|max:100',
                'descripcio' => 'sometimes|string',
                'ubicacio' => 'sometimes|string|max:100',
                'aforament' => 'sometimes|integer|min:1',
                'imatge' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'horaris' => 'nullable|array',
                'horaris.*.hora_inici' => 'required_with:horaris|date',
                'horaris.*.hora_final' => 'required_with:horaris|date|after:horaris.*.hora_inici',
            ],
            [
                'nom.max' => 'El nom no pot superar els 100 caràcters.',
                'aforament.integer' => 'L\'aforament ha de ser un nombre enter.',
                'aforament.min' => 'L\'aforament ha de ser d\'almenys 1 persona.',
                'imatge.image' => 'El fitxer ha de ser una imatge.',
                'imatge.max' => 'La imatge no pot pesar més de 2MB.',
                'horaris.*.hora_final.after' => 'L\'hora de finalització ha de ser posterior a la d\'inici.',
            ]
        );

        $activitat = DB::transaction(function () use ($request, $activitat) {

            // Actualitzem només els camps que venen a la Request
            $activitat->fill($request->except(['imatge', 'horaris']));

            if ($request->hasFile('imatge')) {
                // Esborrar la imatge antiga si existeix
                if ($activitat->imatge) {
                    Storage::disk('public')->delete($activitat->imatge);
                }

                // Guardar la nova imatge
                $path = $request->file('imatge')->store('imatges', 'public');
                $activitat->imatge = $path;
            }

            $activitat->save();

            // Actualització dels horaris: Esborrem els antics i creem els nous
            if ($request->has('horaris') && is_array($request->horaris)) {
                $activitat->horaris()->delete(); // Borrem els vells
                
                foreach ($request->horaris as $horariData) {
                    $activitat->horaris()->create([
                        'hora_inici' => $horariData['hora_inici'],
                        'hora_final' => $horariData['hora_final'],
                    ]);
                }
            }

            return $activitat;
        });

        return response()->json($activitat->load('horaris'), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $activitat = Activitat::findOrFail($id);

        // Esborrar la imatge física del servidor abans d'eliminar l'activitat
        if ($activitat->imatge) {
            Storage::disk('public')->delete($activitat->imatge);
        }

        $activitat->delete();

        return response()->json(['message' => 'Activitat eliminada correctament'], 200);
    }
}