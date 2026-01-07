<?php

use App\Http\Controllers\Api\UsersController;
use Illuminate\Support\Facades\Route;

Route::get('/', [UsersController::class, 'index']);
Route::post('/', [UsersController::class, 'store']);
Route::put('{user}', [UsersController::class, 'update']);
Route::delete('{user}', [UsersController::class, 'destroy']);
Route::patch('{user}/status', [UsersController::class, 'toggleStatus']);
