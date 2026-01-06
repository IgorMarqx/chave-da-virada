<?php

use App\Http\Controllers\Api\ConcursosController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ConcursosController::class, 'index']);
Route::post('create', [ConcursosController::class, 'create']);
