<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ReservaAutocaravanaController;
use App\Http\Controllers\Api\ActivitatController;
use App\Http\Controllers\Api\UserController;

// Rutes públiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutes d'activitats per als visitants
Route::get('/activitats', [ActivitatController::class, 'index']);
Route::get('/activitats/{activitat}', [ActivitatController::class, 'show']);


// Rutes protegides
Route::middleware('auth:sanctum')->group(function () {

    // Tancar sessió
    Route::post('/logout', [AuthController::class, 'logout']);

    // Rutes de reserves d'autocaravanes
    Route::apiResource('reserves', ReservaAutocaravanaController::class);

    // Rutes d'activitats per a l'administrador (crear, editar, esborrar)
    Route::post('/activitats', [ActivitatController::class, 'store']);
    Route::put('/activitats/{activitat}', [ActivitatController::class, 'update']);
    Route::delete('/activitats/{activitat}', [ActivitatController::class, 'destroy']);

});

Route::middleware('auth:sanctum')->group(function () {

    // usuarios
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // perfil propio
    Route::get('/me', [UserController::class, 'me']);

});

