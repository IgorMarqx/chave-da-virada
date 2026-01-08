<?php

use App\Http\Controllers\Api\RevisaoConfiguracaoController;
use App\Http\Controllers\Api\RevisoesController;
use Illuminate\Support\Facades\Route;

Route::get('hoje', [RevisoesController::class, 'today']);
Route::get('configuracao', [RevisaoConfiguracaoController::class, 'show']);
Route::put('configuracao', [RevisaoConfiguracaoController::class, 'update']);
