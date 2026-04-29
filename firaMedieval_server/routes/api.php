<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ReservaAutocaravanaController;
use App\Http\Controllers\Api\ActivitatController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AparcamentController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\InscripcioController;
use Illuminate\Support\Facades\Password;

// Rutes públiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutes d'activitats per als visitants
Route::get('/activitats', [ActivitatController::class, 'index']);
Route::get('/activitats/{activitat}', [ActivitatController::class, 'show']);

// Rutes per a desplegables i filtres
Route::get('/aparcaments', [AparcamentController::class, 'index']);
Route::get('/categories', [CategoriaController::class, 'index']);

Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink($request->only('email'));

    return $status === Password::RESET_LINK_SENT
        ? response()->json(['message' => 'Email enviat'])
        : response()->json(['message' => 'Email no trobat'], 404);
});

Route::post('/reset-password', function (Request $request) {
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed',
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            $user->forceFill(['password' => bcrypt($password)])->save();
        }
    );

    return $status === Password::PASSWORD_RESET
        ? response()->json(['message' => 'Contrasenya restablerta'])
        : response()->json(['message' => 'Token invàlid'], 400);
});


// Rutes protegides
Route::middleware('auth:sanctum')->group(function () {

    // Autenticació
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [UserController::class, 'me']);

    // Aparcaments
    Route::post('/aparcaments', [AparcamentController::class, 'store']);
    Route::put('/aparcaments/{id}', [AparcamentController::class, 'update']);
    Route::delete('/aparcaments/{id}', [AparcamentController::class, 'destroy']);

    // Reserves d'autocaravanes
    Route::get('/reserves', [ReservaAutocaravanaController::class, 'index']);
    Route::post('/reserves', [ReservaAutocaravanaController::class, 'store']);
    Route::get('/reserves/{id}', [ReservaAutocaravanaController::class, 'show']);
    Route::delete('/reserves/{id}', [ReservaAutocaravanaController::class, 'cancel']);

    // Activitats
    Route::post('/activitats', [ActivitatController::class, 'store']);
    Route::put('/activitats/{activitat}', [ActivitatController::class, 'update']);
    Route::delete('/activitats/{activitat}', [ActivitatController::class, 'destroy']);

    // Gestió d'usuaris
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // inscripcions d'activitats
    Route::get('/inscripcions', [InscripcioController::class, 'index']);
    Route::post('/inscripcions', [InscripcioController::class, 'store']);
    Route::get('/inscripcions/{id}', [InscripcioController::class, 'show']);
    Route::delete('/inscripcions/{id}', [InscripcioController::class, 'destroy']);
});
