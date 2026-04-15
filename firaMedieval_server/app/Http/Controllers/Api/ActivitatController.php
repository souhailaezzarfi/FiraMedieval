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

        $request->validate(
            [
                'nom' => 'required|string|max:100',
                'organitzador' => 'required|string|max:100',
                'descripcio' => 'required|string',
                'ubicacio' => 'required|string|max:100',
                'aforament' => 'nullable|integer|min:1',
                'imatge' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ],
            [
                'nom.required' => 'El nom de l\'activitat és obligatori.',
                'nom.max' => 'El nom no pot superar els 100 caràcters.',
                'organitzador.required' => 'Has d\'indicar qui organitza l\'activitat.',
                'descripcio.required' => 'La descripció és necessària per als assistents.',
                'ubicacio.required' => 'Has d\'indicar la ubicació de l\'activitat.',
                'aforament.integer' => 'El aforament ha de ser un nombre entero.',
                'aforament.min' => 'El aforament ha de ser almenys 1 personatge.',
                'imatge.image' => 'El fitxer ha de ser una imatge.',
                'imatge.max' => 'La imatge no pot pesar més de 2MB.',

            ]
        );


        //Ejecutar la validación

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

            $activitat->save(); //Guardamos la actividad

            //Guardamos los horarios vinculados
            if ($request->has('horaris')) {
                foreach ($request->horaris as $horari) {
                    // Esto crea automáticamente el horario con el activitat_id correcto
                    $activitat->horaris()->create($horari);
                }
            }

            return $activitat; //Devolvemos el objeto creado
        });

        return response()->json($activitat->load('horaris'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //

        return Activitat::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {


        $request->validate(
            [
                'nom' => 'string|max:100',
                'organitzador' => 'string|max:100',
                'descripcio' => 'string',
                'ubicacio' => 'string|max:100',
                'aforament' => 'integer|min:1',
                'imatge' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ],
            [
                'nom.max' => 'El nom no pot superar els 100 caràcters.',
                'aforament.integer' => 'El aforament ha de ser un nombre entero.',
                'aforament.min' => 'El aforament ha de ser almenys 1 personatge.',
                'imatge.image' => 'El fitxer ha de ser una imatge.',
                'imatge.max' => 'La imatge no pot pesar més de 2MB.',
            ]
        );


        //Ejecutar la validación

        $activitat = Activitat::findOrFail($id);

        // Solo actualizamos si el usuario envió ese campo específicamente
        if ($request->has('nom')) $activitat->nom = $request->nom;
        if ($request->has('organitzador')) $activitat->organitzador = $request->organitzador;
        if ($request->has('descripcio')) $activitat->descripcio = $request->descripcio;
        if ($request->has('ubicacio')) $activitat->ubicacio = $request->ubicacio;
        if ($request->has('aforament')) $activitat->aforament = $request->aforament;


        if ($request->hasFile('imatge')) {

            // A. Borrar la imagen antigua si existe
            if ($activitat->imatge) {
                Storage::disk('public')->delete($activitat->imatge);
            }

            // B. Guardar la nueva imagen
            $path = $request->file('imatge')->store('imatges', 'public');
            $activitat->imatge = $path;
        }

        $activitat->save();

        return response()->json($activitat);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $activitat = Activitat::findOrFail($id);

        // Borrar imagen física
        if ($activitat->imatge) {
            Storage::disk('public')->delete($activitat->imatge);
        }

        $activitat->delete();

        return response()->json(['message' => 'Activitat eliminada'], 200);
    }
}
