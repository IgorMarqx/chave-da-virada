<?php

use App\Http\Controllers\Api\ConcursosController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ConcursosController::class, 'index']);
Route::post('create', [ConcursosController::class, 'create']);
Route::patch('{concurso}', [ConcursosController::class, 'update']);
Route::delete('{concurso}', [ConcursosController::class, 'destroy']);
