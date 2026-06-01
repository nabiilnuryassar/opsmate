<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BusinessController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\ReminderController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\AIController;
use Illuminate\Support\Facades\Route;

// Public auth routes.
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Authenticated routes.
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/user', fn (\Illuminate\Http\Request $request) => $request->user());

    // Business profile (tenant-scoped to the user's active business).
    Route::get('/business', [BusinessController::class, 'show']);
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
    Route::put('/business', [BusinessController::class, 'update']);

    // Customers (tenant-scoped).
    Route::get('/customers/{customer}/orders', [CustomerController::class, 'orders']);
    Route::apiResource('customers', CustomerController::class);

    // Products / services (tenant-scoped). low-stock before the resource catch-all.
    Route::get('/products/low-stock', [ProductController::class, 'lowStock']);
    Route::get('/products/{product}/stock-movements', [ProductController::class, 'stockMovements']);
    Route::post('/products/{product}/stock-adjustment', [ProductController::class, 'stockAdjustment']);
    Route::apiResource('products', ProductController::class);

    // Orders (tenant-scoped). Status PATCH endpoints before the resource catch-all.
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
    Route::patch('/orders/{order}/payment-status', [OrderController::class, 'updatePaymentStatus']);
    Route::apiResource('orders', OrderController::class);

    // Invoices (tenant-scoped). Custom endpoints before the resource catch-all.
    Route::post('/invoices/from-order/{order}', [InvoiceController::class, 'fromOrder']);
    Route::get('/invoices/{invoice}/pdf', [InvoiceController::class, 'pdf']);
    Route::get('/invoices/{invoice}/text', [InvoiceController::class, 'text']);
    Route::patch('/invoices/{invoice}/status', [InvoiceController::class, 'updateStatus']);
    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show']);

    // Reminders (tenant-scoped).
    Route::get('/reminders', [ReminderController::class, 'index']);
    Route::patch('/reminders/{reminder}/done', [ReminderController::class, 'done']);
    Route::patch('/reminders/{reminder}/snooze', [ReminderController::class, 'snooze']);
    Route::post('/reminders/{reminder}/generate-message', [ReminderController::class, 'generateMessage']);

    // Daily reports (tenant-scoped). Specific routes before {date} catch-all.
    Route::get('/reports/daily', [ReportController::class, 'daily']);
    Route::get('/reports/daily/{date}/pdf', [ReportController::class, 'pdf']);
    Route::get('/reports/daily/{date}', [ReportController::class, 'dailyForDate']);

    // AI assistant (tenant-scoped, rate-limited).
    Route::post('/ai/chat', [AIController::class, 'chat']);
    Route::get('/ai/messages', [AIController::class, 'messages']);
    Route::get('/dashboard/ai-summary', [AIController::class, 'dashboardSummary']);
    Route::post('/ai/generate-follow-up', [AIController::class, 'generateFollowUp']);
    Route::post('/ai/generate-promo-ideas', [AIController::class, 'generatePromoIdeas']);
    Route::post('/ai/generate-daily-summary', [AIController::class, 'generateDailySummary']);
});
