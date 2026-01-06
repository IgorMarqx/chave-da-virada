<?php

use App\Http\Controllers\Api\EstudosController;
use Illuminate\Support\Facades\Route;

Route::get('topico/{topico}', [EstudosController::class, 'listByTopico']);
Route::post('/', [EstudosController::class, 'store']);
