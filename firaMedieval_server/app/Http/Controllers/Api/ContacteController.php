<?php

namespace App\Http\Controllers\Api; 

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContacteController extends Controller
{
    public function enviar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom'      => 'required|string|min:2',
            'email'    => 'required|email',
            'telefon'  => 'nullable|string',
            'missatge' => 'required|string|min:10',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $dades = $validator->validated();

        Mail::send([], [], function ($mail) use ($dades) {
            $mail->to('ezzarfi.souhaila@gmail.com')
                ->subject('Nova consulta - ' . $dades['nom'])
                ->replyTo($dades['email'], $dades['nom'])
                ->html("
                    <h2 style='text-color: #432918 ;'>Nova consulta des del formulari web de la Fira Medieval d'Hostalric</h2>
                    <p><strong>Nom:</strong> {$dades['nom']}</p>
                    <p><strong>Email:</strong> {$dades['email']}</p>
                    <p><strong>Telèfon:</strong> " . ($dades['telefon'] ?? 'No facilitat') . "</p>
                    <hr>
                    <p><strong>Missatge:</strong></p>
                    <p>{$dades['missatge']}</p>
                 ");
        });

        return response()->json(['ok' => true]);
    }
}
