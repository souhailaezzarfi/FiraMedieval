<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categorias = Categoria::all();
        return response()->json($categorias);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:50|unique:categoria,nom',
        ],
        [
            'nom.required' => 'El nom de la categoria es obligatori.',
            'nom.max' => 'El nom de la categoria no pot superar els 50 caracters.',
            'nom.unique' => 'El nom de la categoria ja existeix.',
        ]);
        $categoria = Categoria::create($request->all());
        return response()->json($categoria, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Categoria::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nom' => 'string|max:50|unique:categoria,nom,'. $id,
        ],
        [
            'nom.max' => 'El nom de la categoria no pot superar els 50 caracters.',
            'nom.unique' => 'El nom de la categoria ja existeix.',
        ]);
        $categoria = Categoria::findOrFail($id);
        $categoria->update($request->all());
        return response()->json($categoria);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->delete();
        return response()->json(['message' => 'Categoria eliminada'], 200);
    }
}
