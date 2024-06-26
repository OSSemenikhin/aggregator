<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::middleware('guest.admin')->group(function () {
    Route::get('/', [\App\Http\Controllers\Admin\AuthController::class, 'index'])->name('home');
    Route::get('login', [\App\Http\Controllers\Admin\AuthController::class, 'showLoginForm'])->name('login');
    Route::post('login', [\App\Http\Controllers\Admin\AuthController::class, 'login'])->name('login_process');
});

Route::middleware('auth.admin')->group(function () {
    Route::get('logout', [\App\Http\Controllers\Admin\AuthController::class, 'logout'])->name('logout');

    Route::resource('/shop', \App\Http\Controllers\Admin\ShopController::class);

    // search shop
    Route::get('/shops/{name}', [ \App\Http\Controllers\Admin\ShopController::class, 'getShopsByName']);
    
    // photos preload
    Route::post('/shop/preload', [ \App\Http\Controllers\Admin\ShopController::class, 'photosPreload'])->name('preload');
});

if (!Auth::guard('admin')->check()) {
    Route::any('{all}', function () {
        return redirect()->route('admin.login');
    })->where(['all' => '.*']);
}
