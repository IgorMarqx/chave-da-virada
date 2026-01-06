<?php

use App\Http\Controllers\Api\TopicosController;
use Illuminate\Support\Facades\Route;

Route::get('disciplina/{disciplina}', [TopicosController::class, 'listByDisciplina']);
Route::get('{topico}', [TopicosController::class, 'show']);
Route::post('create', [TopicosController::class, 'create']);
