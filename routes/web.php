<?php

use App\Http\Controllers\Front\WebController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', [WebController::class, 'dashboard'])->name('dashboard');
Route::get('estudos', [WebController::class, 'estudos'])->name('estudos');
Route::get('estudos/concursos/{concurso}', [WebController::class, 'concursoDisciplinas'])->name('estudos.concursos');
Route::get('estudos/disciplinas/{disciplina}', [WebController::class, 'disciplinaTopicos'])->name('estudos.disciplinas');
Route::get('estudos/topicos/{topico}', [WebController::class, 'topicoDetalhe'])->name('estudos.topicos');
Route::get('estudos/topicos/{topico}/revisao', [WebController::class, 'topicoRevisao'])->name('estudos.topicos.revisao');
Route::get('users', [WebController::class, 'users'])->middleware('role:admin')->name('users.index');
Route::get('first-access-password', function () {
    return Inertia::render('auth/first-access-password');
})->middleware('auth')->name('first-access-password');

Route::middleware('role:admin')->group(function () {
    // Route::get('users', /* ... */);
});

require __DIR__ . '/settings.php';
