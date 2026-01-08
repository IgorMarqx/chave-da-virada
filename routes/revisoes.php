<?php

use App\Http\Controllers\Api\RevisoesController;
use Illuminate\Support\Facades\Route;

Route::post('{id}/concluir', [RevisoesController::class, 'concluir']);
