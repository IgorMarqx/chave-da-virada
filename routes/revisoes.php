<?php

use App\Http\Controllers\Api\RevisoesController;
use Illuminate\Support\Facades\Route;

Route::post('{id}/concluir', [RevisoesController::class, 'concluir']);
Route::post('{id}/iniciar', [RevisoesController::class, 'iniciar']);
