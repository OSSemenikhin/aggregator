<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// \App\Services\GenerateRandomData::generateRandomData();

// dd(str('filters')->append('what??')->append('second')->append(['asdf', 'asdfas']));
// \App\Filters\LocationFilter::apply();

// dd(strtolower(Carbon::now()->isoFormat('dddd')));

Route::get('/', 'App\Http\Controllers\ShopController@index');

Route::get('/test', function () {
    return \App\Models\City::with('areas')->with('subways')->get();
});
