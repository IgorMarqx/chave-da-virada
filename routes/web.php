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

require __DIR__ . '/settings.php';
