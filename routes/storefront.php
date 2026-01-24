<?php

use App\Http\Controllers\Storefront\BrandController;
use App\Http\Controllers\Storefront\CategoryController;
use App\Http\Controllers\Storefront\ImageController;
use App\Http\Controllers\Storefront\IngredientController;
use App\Http\Controllers\Storefront\ProductController;
use App\Http\Controllers\Storefront\TagController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('hesabim', function () {
        return Inertia::render('account');
    })->name('account');
});

Route::resource('products', ProductController::class)->only(['index', 'show']);
Route::resource('categories', CategoryController::class)->only(['index', 'show']);
Route::resource('brands', BrandController::class)->only(['index', 'show']);
Route::resource('tags', TagController::class)->only(['index', 'show']);
Route::resource('ingredients', IngredientController::class)->only(['index', 'show']);
Route::resource('images', ImageController::class)->only(['index', 'show']);
