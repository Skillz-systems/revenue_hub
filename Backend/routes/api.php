<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Staff login route
//Route::post('auth/login', [AuthController::class, 'login']);

// staff store new password route
Route::post('auth/store-password/', [AuthController::class, 'storePassword']);

Route::middleware('auth:sanctum')->group(function () {

    Route::apiResource('/staff', UserController::class);
});
