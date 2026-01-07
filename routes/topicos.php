<?php

use App\Http\Controllers\Api\TopicosController;
use Illuminate\Support\Facades\Route;

Route::get('disciplina/{disciplina}', [TopicosController::class, 'listByDisciplina']);
Route::patch('ordem', [TopicosController::class, 'updateOrder']);
Route::get('{topico}', [TopicosController::class, 'show']);
Route::post('create', [TopicosController::class, 'create']);
Route::patch('{topico}', [TopicosController::class, 'update']);
Route::delete('{topico}', [TopicosController::class, 'destroy']);
