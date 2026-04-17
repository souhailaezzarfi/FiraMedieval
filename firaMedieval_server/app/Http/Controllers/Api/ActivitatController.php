<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\Activitat;
use App\Models\Categoria;


class ActivitatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $activitats = Activitat::with(['horaris', 'categories'])->get();

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
                'categories' => 'required|array|min:1',
                'categories.*' => 'required|string|max:50',
                'horaris' => 'required|array|min:1',
                'horaris.*.hora_inici' => 'required_with:horaris|date',
                'horaris.*.hora_final' => 'nullable|date|after:horaris.*.hora_inici',
                'imatge' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ],
            [
                'nom.required' => 'El nom de l\'activitat és obligatori.',
                'nom.max' => 'El nom no pot superar els 100 caràcters.',
                'organitzador.required' => 'Has d\'indicar qui organitza l\'activitat.',
                'descripcio.required' => 'La descripció és necessària per als assistents.',
                'ubicacio.required' => 'Has d\'indicar la ubicació de l\'activitat.',
                'aforament.integer' => 'L\'aforament ha de ser un nombre enter.',
                'aforament.min' => 'L\'aforament ha de ser d\'almenys 1 persona.',
                'categories.required' => 'L\'activitat ha de tenir com a mínim una categoria.',
                'categories.min' => 'L\'activitat ha de tenir com a mínim una categoria.',
                'categories.*.max' => 'El nom de la categoria no pot superar els 50 caràcters.',
                'horaris.*.hora_inici.required_with' => 'L\'hora d\'inici ha de ser indicada.',
                'horaris.*.hora_final.after' => 'L\'hora de finalització ha de ser posterior a la d\'inici.',
                'imatge.image' => 'El fitxer ha de ser una imatge.',
                'imatge.max' => 'La imatge no pot pesar més de 2MB.',
            ]
        );

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

            $activitat->save();

            // Guardar els horaris establerts
            if ($request->has('horaris') && is_array($request->horaris)) {
                foreach ($request->horaris as $horariData) {
                    $activitat->horaris()->create([
                        'hora_inici' => $horariData['hora_inici'],
                        'hora_final' => $horariData['hora_final'] ?? null,
                    ]);
                }
            }

            // Guardar les categories (crear-les si no existeixen)
            $categoryIds = [];
            foreach ($request->categories as $nomCategoria) {
                $categoria = Categoria::firstOrCreate(['nom' => $nomCategoria]);
                $categoryIds[] = $categoria->id;
            }
            $activitat->categories()->attach($categoryIds);

            return $activitat;
        });

        return response()->json($activitat->load(['horaris', 'categories']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $activitat = Activitat::with(['horaris', 'categories'])->findOrFail($id);

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
                'nom' => 'sometimes|required|string|max:100',
                'organitzador' => 'sometimes|required|string|max:100',
                'descripcio' => 'sometimes|required|string',
                'ubicacio' => 'sometimes|required|string|max:100',
                'aforament' => 'sometimes|nullable|integer|min:1',
                'categories' => 'sometimes|required|array|min:1',
                'categories.*' => 'required|string|max:50',
                'horaris' => 'sometimes|required|array|min:1',
                'horaris.*.hora_inici' => 'required_with:horaris|date',
                'horaris.*.hora_final' => 'nullable|date|after:horaris.*.hora_inici',
                'imatge' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ],
            [
                'nom.required' => 'El nom es obligatori.',
                'nom.max' => 'El nom no pot superar els 100 caràcters.',
                'organitzador.required' => 'Has d\'indicar qui organitza l\'activitat.',
                'descripcio.required' => 'La descripció es obligatoria per als assistents.',

                'aforament.integer' => 'L\'aforament ha de ser un nombre enter.',
                'aforament.min' => 'L\'aforament ha de ser d\'almenys 1 persona.',
                'categories.required' => 'Has d\'indicar alguna categoria.',
                'categories.min' => 'Has d\'indicar alguna categoria.',
                'categories.*.max' => 'El nom de la categoria no pot superar els 50 caràcters.',
                'horaris.required' => 'Has d\'indicar algun horari.',
                'horaris.*.hora_inici.required_with' => 'L\'hora d\'inici ha de ser indicada.',
                'horaris.*.hora_final.after' => 'L\'hora de finalització ha de ser posterior a la d\'inici.',
                'imatge.image' => 'El fitxer ha de ser una imatge.',
                'imatge.max' => 'La imatge no pot pesar més de 2MB.',
            ]
        );

        $activitat = DB::transaction(function () use ($request, $activitat) {

            $activitat->fill($request->except(['imatge', 'horaris', 'categories']));

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

            // Esborrar els horaris antics i afegir els nous
            if ($request->has('horaris') && is_array($request->horaris)) {
                $activitat->horaris()->delete();
                foreach ($request->horaris as $horariData) {
                    $activitat->horaris()->create([
                        'hora_inici' => $horariData['hora_inici'],
                        'hora_final' => $horariData['hora_final'] ?? null,
                    ]);
                }
            }

            // Actualitzar les categories (crear-les si no existeixen)
            $categoryIds = [];
            foreach ($request->categories as $nomCategoria) {
                $categoria = Categoria::firstOrCreate(['nom' => $nomCategoria]);
                $categoryIds[] = $categoria->id;
            }
            $activitat->categories()->sync($categoryIds);

            return $activitat;
        });

        // Esborrar categoria si no pertany a cap altra activitat
        Categoria::doesntHave('activitats')->delete();

        return response()->json($activitat->load(['horaris', 'categories']), 200);
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

        // Esborrar categoria si no pertany a cap altra activitat
        Categoria::doesntHave('activitats')->delete();

        return response()->json(['message' => 'Activitat eliminada correctament'], 200);
    }
}
