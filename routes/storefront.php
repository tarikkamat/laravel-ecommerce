<?php

use App\Http\Controllers\Storefront\HomeController;
use App\Http\Controllers\Storefront\AccountController;
use Illuminate\Support\Facades\Route;

Route::group(['as' => 'storefront.'], function () {
    Route::resource('hesabim', AccountController::class)->only(['index'])->names([
        'index' => 'accounts.index',
    ])->middleware(['auth', 'verified']);

    Route::get('/', [HomeController::class, 'index'])->name('home.index');
    Route::redirect('/anasayfa', '/')->name('home.redirect');
});
