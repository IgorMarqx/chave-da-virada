<?php

use App\Http\Controllers\Api\AnotacoesController;
use Illuminate\Support\Facades\Route;

Route::get('topico/{topico}', [AnotacoesController::class, 'showByTopico']);
Route::post('/', [AnotacoesController::class, 'upsert']);
