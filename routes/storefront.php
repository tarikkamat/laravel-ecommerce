<?php

use App\Http\Controllers\Storefront\HomeController;
use App\Http\Controllers\Storefront\AccountController;
use App\Http\Controllers\Storefront\BrandController;
use App\Http\Controllers\Storefront\ProductController;
use Illuminate\Support\Facades\Route;

Route::group(['as' => 'storefront.'], function () {
    Route::resource('hesabim', AccountController::class)->only(['index'])->names([
        'index' => 'accounts.index',
    ])->middleware(['auth', 'verified']);

    Route::get('/', [HomeController::class, 'index'])->name('home.index');
    Route::redirect('/anasayfa', '/')->name('home.redirect');

    Route::get('/markalar', [BrandController::class, 'index'])->name('brands.index');
    Route::get('/markalar/{identifier}/urunler', [BrandController::class, 'getProductsByBrandSlug'])->name('brands.products');

    Route::get('/urunler', [ProductController::class, 'index'])->name('products.index');
    Route::get('/urunler/{identifier}', [ProductController::class, 'show'])->name('products.show');
});
