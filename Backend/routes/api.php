<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/



// Staff login route
Route::post('auth/login', [AuthController::class, 'login']);

// staff store new password route
Route::post('auth/store-password/', [AuthController::class, 'storePassword']);

Route::middleware('auth:sanctum')->group(function () {

    Route::apiResource('/staff', UserController::class);
    Route::apiResource('/property', PropertyController::class);
    Route::post('/property/upload', [PropertyController::class, 'upload']);
});
