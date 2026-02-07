<?php

use App\Http\Controllers\Storefront\HomeController;
use App\Http\Controllers\Storefront\AccountController;
use App\Http\Controllers\Storefront\BrandController;
use App\Http\Controllers\Storefront\CategoryController;
use App\Http\Controllers\Storefront\CartPageController;
use App\Http\Controllers\Storefront\CheckoutPageController;
use App\Http\Controllers\Storefront\IyzicoCallbackController;
use App\Http\Controllers\Storefront\CheckoutResultController;
use App\Http\Controllers\Storefront\AccountOrderController;
use App\Http\Controllers\Storefront\PageController;
use App\Http\Controllers\Storefront\ProductController;
use App\Http\Controllers\Storefront\ProductCommentController;
use Illuminate\Support\Facades\Route;

Route::group(['as' => 'storefront.'], function () {
    Route::resource('hesabim', AccountController::class)->only(['index'])->names([
        'index' => 'accounts.index',
    ])->middleware(['auth', 'verified']);

    Route::middleware(['auth', 'verified'])->prefix('hesabim')->group(function () {
        Route::get('/siparislerim', [AccountOrderController::class, 'index'])->name('accounts.orders.index');
        Route::get('/siparislerim/{order}', [AccountOrderController::class, 'show'])->name('accounts.orders.show');
        Route::post('/adres', [AccountController::class, 'store'])->name('accounts.addresses.store');
    });

    Route::get('/', [HomeController::class, 'index'])->name('home.index');
    Route::redirect('/anasayfa', '/')->name('home.redirect');

    Route::get('/markalar', [BrandController::class, 'index'])->name('brands.index');
    Route::get('/markalar/{identifier}/urunler', [BrandController::class, 'getProductsByBrandSlug'])->name('brands.products');

    Route::get('/kategoriler', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/kategoriler/{identifier}/urunler', [CategoryController::class, 'getProductsByCategorySlug'])->name('categories.products');

    Route::get('/urunler', [ProductController::class, 'index'])->name('products.index');
    Route::get('/urunler/{identifier}', [ProductController::class, 'show'])->name('products.show');
    Route::post('/urunler/{product}/yorumlar', [ProductCommentController::class, 'store'])
        ->middleware(['auth', 'verified'])
        ->name('products.comments.store');

    Route::get('/sepet', CartPageController::class)->name('cart.index');
    Route::get('/checkout', CheckoutPageController::class)->name('checkout.index');
    Route::get('/checkout/sonuc/{order}', CheckoutResultController::class)->name('checkout.result');
    Route::post('/odeme/iyzico/callback', IyzicoCallbackController::class)
        ->withoutMiddleware([
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        ])
        ->name('payments.iyzico.callback');

    Route::get('/sayfa/{slug}', [PageController::class, 'show'])->name('pages.show');
    Route::post('/sayfa/{slug}/iletisim', [PageController::class, 'contact'])->name('pages.contact');
});
