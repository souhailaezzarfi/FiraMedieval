<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ActivitatController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\AparcamentController;
use App\Http\Controllers\Api\ReservaAutocaravanaController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Activitats
Route::apiResource('activitats', ActivitatController::class);
Route::apiResource('categories', CategoriaController::class);
Route::apiResource('aparcaments', AparcamentController::class);

// Reserva autocaravanes
Route::apiResource('reserves-autocaravanes', ReservaAutocaravanaController::class);