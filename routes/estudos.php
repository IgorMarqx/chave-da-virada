<?php

use App\Http\Controllers\Api\EstudosController;
use Illuminate\Support\Facades\Route;

Route::get('topico/{topico}', [EstudosController::class, 'listByTopico']);
Route::get('topicos', [EstudosController::class, 'listTopicos']);
Route::post('/', [EstudosController::class, 'store']);
