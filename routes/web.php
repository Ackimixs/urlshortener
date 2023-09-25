<?php

use App\Models\Url;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('urlshortener.index');
});

Route::get('/r/{code}', function () {
    $code = request()->route('code');

    $url = Url::where('code', $code)->first();

    if (isset($url) && filter_var($url->long_url, FILTER_VALIDATE_URL)) {
        return redirect($url->long_url);
    } else {
        return redirect('/');
    }
});
