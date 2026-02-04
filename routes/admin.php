<?php

use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DiscountController;
use App\Http\Controllers\Admin\ImageController;
use App\Http\Controllers\Admin\IngredientController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ImagePickerController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\OrderShipmentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role.admin'])->prefix('suug')->as('admin.')->group(function () {
    Route::resource('dashboard', DashboardController::class);
    Route::resource('brands', BrandController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('discounts', DiscountController::class);
    Route::resource('images', ImageController::class);
    Route::get('images-picker', [ImagePickerController::class, 'index'])->name('images.picker');
    Route::resource('ingredients', IngredientController::class);
    Route::resource('pages', PageController::class);
    Route::get('settings', [SettingsController::class, 'edit'])->name('settings.edit');
    Route::put('settings', [SettingsController::class, 'update'])->name('settings.update');
    Route::resource('products', ProductController::class);
    Route::resource('tags', TagController::class);
    Route::resource('users', UserController::class);
    Route::resource('orders', OrderController::class)->only(['index', 'show', 'update']);
    Route::post('orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    Route::post('orders/{order}/refund', [OrderController::class, 'refund'])->name('orders.refund');
    Route::patch('orders/{order}/shipments/{shipment}', [OrderShipmentController::class, 'update'])->name('orders.shipments.update');
    Route::get('orders/{order}/shipments/{shipment}/label', [OrderShipmentController::class, 'label'])->name('orders.shipments.label');
    Route::post('orders/shipments/labels', [OrderShipmentController::class, 'labels'])->name('orders.shipments.labels');
});
