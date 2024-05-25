<?php

use App\Models\User;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DemandNoticeController;
use App\Http\Controllers\PaymentController;
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

    Route::post('/demand-notice', [DemandNoticeController::class, 'index']);
    Route::post('/demand-notice/create', [DemandNoticeController::class, 'store']);
    Route::get('/demand-notice/view/{demandNotice}', [DemandNoticeController::class, 'show']);
    Route::put('/demand-notice/update/{demandNotice}', [DemandNoticeController::class, 'update']);
    Route::delete('/demand-notice/delete/{demandNotice}', [DemandNoticeController::class, 'destroy']);

    Route::post('/payment', [PaymentController::class, 'index']);
    Route::get('/payment/view/{id}', [PaymentController::class, 'view']);
    Route::apiResource('/staff', UserController::class);
    Route::apiResource('/property', PropertyController::class);
});
Route::get('/payment/generate-account/{id}', [PaymentController::class, 'generateAccount']);
