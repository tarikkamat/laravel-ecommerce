<?php

use App\Http\Controllers\Api\Admin\ImagePickerController as AdminImagePickerController;
use App\Http\Controllers\Api\ApiHomeController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\GeliverWebhookController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\SearchController;
use Illuminate\Support\Facades\Route;

Route::prefix('home')->group(function () {
    Route::get('/categories', [ApiHomeController::class, 'categories'])->name('api.home.categories');
    Route::get('/products', [ApiHomeController::class, 'featuredProducts'])->name('api.home.products');
    Route::get('/brands', [ApiHomeController::class, 'brands'])->name('api.home.brands');
    Route::get('/brands/{brandId}/products', [ApiHomeController::class, 'brandProducts'])->name('api.home.brand.products');
});

Route::get('/search/suggestions', [SearchController::class, 'index'])->name('api.search.suggestions');

Route::prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('api.cart.index');
    Route::post('/items', [CartController::class, 'storeItem'])->name('api.cart.items.store');
    Route::patch('/items/{itemId}', [CartController::class, 'updateItem'])->name('api.cart.items.update');
    Route::delete('/items/{itemId}', [CartController::class, 'destroyItem'])->name('api.cart.items.destroy');
    Route::delete('/clear', [CartController::class, 'clear'])->name('api.cart.clear');
    Route::post('/discount', [CartController::class, 'applyDiscount'])->name('api.cart.discount.apply');
    Route::delete('/discount', [CartController::class, 'removeDiscount'])->name('api.cart.discount.remove');
    Route::post('/merge', [CartController::class, 'merge'])->middleware('auth')->name('api.cart.merge');
});

Route::prefix('checkout')->group(function () {
    Route::get('/summary', [CheckoutController::class, 'summary'])->name('api.checkout.summary');
    Route::post('/address', [CheckoutController::class, 'storeAddress'])->name('api.checkout.address');
    Route::post('/shipping/rates', [CheckoutController::class, 'rates'])->name('api.checkout.shipping.rates');
    Route::post('/shipping/select', [CheckoutController::class, 'selectShipping'])->name('api.checkout.shipping.select');
    Route::post('/confirm', [CheckoutController::class, 'confirm'])->name('api.checkout.confirm');
});

Route::prefix('payments')->group(function () {
    Route::post('/iyzico/initialize', [PaymentController::class, 'initialize'])->name('api.payments.iyzico.initialize');
    Route::post('/iyzico/webhook', [PaymentController::class, 'webhook'])->name('api.payments.iyzico.webhook');
});

Route::middleware(['auth', 'role.admin'])->prefix('admin')->group(function () {
    Route::get('/images', [AdminImagePickerController::class, 'index'])->name('api.admin.images');
});

Route::post('/webhooks/geliver', GeliverWebhookController::class)->name('api.webhooks.geliver');
