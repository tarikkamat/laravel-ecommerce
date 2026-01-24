<?php

use App\Http\Controllers\Storefront\HomeController;
use App\Http\Controllers\Storefront\AccountController;
use App\Http\Controllers\Storefront\BrandController;
use App\Http\Controllers\Storefront\CategoryController;
use App\Http\Controllers\Storefront\IngredientController;
use App\Http\Controllers\Storefront\ProductController;
use App\Http\Controllers\Storefront\TagController;
use Illuminate\Support\Facades\Route;

Route::name('storefront.')->group(function () {
    Route::resource('hesabim', AccountController::class)->names([
        'index' => 'accounts.index',
    ])->middleware(['auth', 'verified']);

    Route::get('/', [HomeController::class, 'index'])->name('home.index');
    Route::redirect('/anasayfa', '/')->name('home.redirect');

    Route::resource('urun', ProductController::class)
        ->names([
            'index' => 'products.index',
            'show' => 'products.show',
        ])->only(['index', 'show']);

    Route::resource('kategori', CategoryController::class)
        ->names([
            'index' => 'categories.index',
            'show' => 'categories.show',
        ])->only(['index', 'show']);

    Route::resource('marka', BrandController::class)
        ->names([
            'index' => 'brands.index',
            'show' => 'brands.show',
        ])->only(['index', 'show']);

    Route::resource('etiket', TagController::class)
        ->names([
            'index' => 'tags.index',
            'show' => 'tags.show',
        ])->only(['index', 'show']);

    Route::resource('malzeme', IngredientController::class)
        ->names([
            'index' => 'ingredients.index',
            'show' => 'ingredients.show',
        ])->only(['index', 'show']);

});
