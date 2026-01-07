<?php

use App\Http\Controllers\Api\DisciplinasController;
use Illuminate\Support\Facades\Route;

Route::post('create', [DisciplinasController::class, 'create']);
Route::get('concurso/{concurso}', [DisciplinasController::class, 'listByConcurso']);
Route::get('recent', [DisciplinasController::class, 'listRecent']);
Route::post('{disciplina}/accessed', [DisciplinasController::class, 'markAccessed']);
