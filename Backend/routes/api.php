<?php

use App\Models\User;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DemandNoticeController;
use App\Http\Controllers\RatingDistrictController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\StatisticController;
use App\Http\Controllers\StreetController;
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
Route::post('property/process-csv', [PropertyController::class, 'processCsv']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('payment/webhook', [PaymentController::class, 'webhook']);

// staff store new password route
Route::post('auth/store-password/', [AuthController::class, 'storePassword']);
Route::post('auth/forgot-password/', [AuthController::class, 'forgotPassword']);
Route::post('user-with-token/{staff}', [UserController::class, 'getUserWithToken']);
Route::put('/staff/update-staff-details/{staff}', [UserController::class, 'update']);
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/demand-notice', [DemandNoticeController::class, 'index']);
    Route::post('/demand-notice/create', [DemandNoticeController::class, 'store']);
    Route::get('/demand-notice/view/{demandNotice}', [DemandNoticeController::class, 'show']);
    Route::put('/demand-notice/update/{demandNotice}', [DemandNoticeController::class, 'update']);
    Route::delete('/demand-notice/delete/{demandNotice}', [DemandNoticeController::class, 'destroy']);

    Route::post('/statistic/all-yearly-data', [StatisticController::class, 'allYearlyData']);
    Route::post('/payment', [PaymentController::class, 'index']);
    Route::get('/payment/view/{id}', [PaymentController::class, 'view']);
    Route::apiResource('/staff', UserController::class);
    Route::post('/property', [PropertyController::class, "index"]);
    Route::post('/property/create', [PropertyController::class, "store"]);
    Route::apiResource('/property', PropertyController::class);

    Route::get('/street', [StreetController::class, "index"]);
    Route::post('/street/create', [StreetController::class, "store"]);
    Route::get('/street/view/{street}', [StreetController::class, "show"]);
    Route::put('/street/update/{street}', [StreetController::class, "update"]);
    Route::delete('/street/delete/{street}', [StreetController::class, "destroy"]);

<<<<<<< Updated upstream
=======
    Route::get('/cadastral-zone', [CadastralZoneController::class, "index"]);
    Route::post('/cadastral-zone/create', [CadastralZoneController::class, "store"]);
    Route::get('/cadastral-zone/view/{cadastralZone}', [CadastralZoneController::class, "show"]);
    Route::put('/cadastral-zone/update/{cadastralZone}', [CadastralZoneController::class, "update"]);
    Route::delete('/cadastral-zone/delete/{cadastralZone}', [CadastralZoneController::class, "destroy"]);

>>>>>>> Stashed changes
    Route::get('/rating-district', [RatingDistrictController::class, "index"]);
    Route::post('/rating-district/create', [RatingDistrictController::class, "store"]);
    Route::get('/rating-district/view/{ratingDistrict}', [RatingDistrictController::class, "show"]);
    Route::put('/rating-district/update/{ratingDistrict}', [RatingDistrictController::class, "update"]);
    Route::delete('/rating-district/delete/{ratingDistrict}', [RatingDistrictController::class, "destroy"]);
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
});

Route::get('/payment/generate-account/{id}', [PaymentController::class, 'generateAccount']);
