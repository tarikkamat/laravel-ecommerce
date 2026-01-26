<?php

use App\Http\Controllers\Api\ApiHomeController;
use Illuminate\Support\Facades\Route;

Route::prefix('home')->group(function () {
    Route::get('/categories', [ApiHomeController::class, 'categories'])->name('api.home.categories');
    Route::get('/products', [ApiHomeController::class, 'featuredProducts'])->name('api.home.products');
    Route::get('/brands', [ApiHomeController::class, 'brands'])->name('api.home.brands');
    Route::get('/brands/{brandId}/products', [ApiHomeController::class, 'brandProducts'])->name('api.home.brand.products');
});
