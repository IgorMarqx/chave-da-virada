<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Http\Request;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware([
    'api',
    EncryptCookies::class,
    AddQueuedCookiesToResponse::class,
    StartSession::class,
    'jwt.auth',
])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::prefix('concursos')->group(base_path('routes/concursos.php'));
    Route::prefix('disciplinas')->group(base_path('routes/disciplinas.php'));
    Route::prefix('topicos')->group(base_path('routes/topicos.php'));
    Route::prefix('estudos')->group(base_path('routes/estudos.php'));
    Route::prefix('anotacoes')->group(base_path('routes/anotacoes.php'));
});
