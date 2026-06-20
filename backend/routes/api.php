<?php

use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\BookmarkController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\CountryController;
use App\Http\Controllers\Api\FeatureController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\PublicCmsController;
use App\Http\Controllers\Api\PublicContentController;
use App\Http\Controllers\Api\PublicationController;
use App\Http\Controllers\Api\RegionController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SpotlightController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('public')->group(function () {
    Route::get('/pages', [PublicCmsController::class, 'pages']);
    Route::get('/pages/path/{path}', [PublicCmsController::class, 'pageByPath'])->where('path', '.*');
    Route::get('/home', [PublicContentController::class, 'home']);
    Route::get('/navigation', [PublicCmsController::class, 'navigation']);
    Route::get('/uploads/{path}', [UploadController::class, 'show'])->where('path', '.*');
    Route::get('/content', [PublicContentController::class, 'index']);
    Route::get('/renewable-energy', [PublicContentController::class, 'renewableEnergy']);
    Route::get('/fossil-fuel', [PublicContentController::class, 'fossilFuel']);
    Route::get('/products', [PublicContentController::class, 'products']);
    Route::get('/products/{product}', [PublicContentController::class, 'product']);
    Route::post('/products/{product}/purchase', [PublicContentController::class, 'purchase']);

    Route::get('/regions', [PublicCmsController::class, 'regions']);
    Route::get('/regions/{id}', [PublicCmsController::class, 'region']);
    Route::get('/countries', [PublicCmsController::class, 'countries']);
    Route::get('/countries/slug/{slug}', [PublicCmsController::class, 'countryBySlug']);
    Route::get('/countries/{id}', [PublicCmsController::class, 'country']);
    Route::get('/spotlights', [PublicCmsController::class, 'spotlights']);
    Route::get('/spotlights/{id}', [PublicCmsController::class, 'spotlight']);
    Route::get('/categories', [PublicCmsController::class, 'categories']);
    Route::get('/categories/slug/{slug}', [PublicCmsController::class, 'categoryBySlug']);
    Route::get('/categories/{id}/pages', [PublicCmsController::class, 'categoryPages']);
    Route::get('/articles', [PublicCmsController::class, 'articles']);
    Route::get('/articles/slug/{slug}', [PublicCmsController::class, 'articleBySlug']);
    Route::get('/articles/{id}', [PublicCmsController::class, 'article']);
    Route::get('/features', [PublicCmsController::class, 'features']);
    Route::get('/blogs', [PublicCmsController::class, 'blogs']);
    Route::get('/blogs/slug/{slug}', [PublicCmsController::class, 'blogBySlug']);
    Route::get('/blogs/{id}', [PublicCmsController::class, 'blog']);
    Route::get('/comments', [PublicCmsController::class, 'comments']);
    Route::get('/media', [PublicCmsController::class, 'media']);
    Route::get('/media/{id}', [PublicCmsController::class, 'mediaItem']);
    Route::get('/publications', [PublicCmsController::class, 'publications']);
    Route::get('/publications/{id}', [PublicCmsController::class, 'publication']);
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

Route::middleware('auth:api')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::apiResource('orders', OrderController::class)->except(['show']);
    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show']);
    Route::get('/invoices/{invoice}/download', [InvoiceController::class, 'download']);
    Route::post('/invoices/{invoice}/telegram', [InvoiceController::class, 'sendToTelegram']);
    Route::get('/analytics', [AnalyticsController::class, 'index']);

    Route::get('/bookmarks/mine', [BookmarkController::class, 'mine']);
    Route::post('/bookmarks', [BookmarkController::class, 'store']);
    Route::delete('/bookmarks/{id}', [BookmarkController::class, 'destroy']);

    Route::middleware('admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('content', ContentController::class)->except(['show']);
        Route::apiResource('regions', RegionController::class);
        Route::apiResource('countries', CountryController::class);
        Route::apiResource('spotlights', SpotlightController::class);
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('articles', ArticleController::class);
        Route::apiResource('features', FeatureController::class);
        Route::apiResource('blogs', BlogController::class);
        Route::apiResource('comments', CommentController::class);
        Route::apiResource('media', MediaController::class);
        Route::apiResource('publications', PublicationController::class);
        Route::apiResource('bookmarks', BookmarkController::class)->except(['store', 'destroy']);
        Route::post('/upload', [UploadController::class, 'store']);
        Route::get('/settings', [SettingController::class, 'index']);
        Route::post('/settings', [SettingController::class, 'upsert']);
    });
});
