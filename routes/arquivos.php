<?php

use App\Http\Controllers\Api\ArquivosController;
use Illuminate\Support\Facades\Route;

Route::get('topico/{topico}', [ArquivosController::class, 'listByTopico']);
Route::post('/', [ArquivosController::class, 'store']);
Route::delete('{arquivo}', [ArquivosController::class, 'destroy']);
