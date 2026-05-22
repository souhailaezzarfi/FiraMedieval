<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProgramaController extends Controller
{
    public function getProgramaPdf()
    {
        $path = 'pdfs/programa.pdf';

        if (Storage::disk('public')->exists($path)) {
            return response()->json([
                'url' => asset('storage/' . $path)
            ]);
        }

        return response()->json(['url' => null]);
    }

    public function uploadProgramaPdf(Request $request)
    {
        $request->validate([
            'pdf' => 'required|file|mimes:pdf|max:10240',
        ]);

        Storage::disk('public')->makeDirectory('pdfs');
        $request->file('pdf')->storeAs('pdfs', 'programa.pdf', 'public');

        return response()->json([
            'message' => 'PDF pujat correctament',
            'url' => asset('storage/pdfs/programa.pdf')
        ]);
    }
}
