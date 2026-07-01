<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Modules\Admin\Middleware\AdminMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        using: function (): void {
            Route::middleware('web')
                ->group(base_path('routes/web.php'));

            Route::middleware('web')
                ->group(base_path('routes/web/admin.php'));

            Route::middleware('web')
                ->group(base_path('routes/web/auth.php'));

            Route::middleware('web')
                ->group(base_path('routes/web/tenant.php'));

            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('api')
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/auth.php'));

            Route::middleware('web')
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/admin/users.php'));

            Route::middleware('web')
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/admin/pricing.php'));

            Route::middleware('web')
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/admin/subscriptions.php'));

            Route::middleware('web')
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/admin/tenants.php'));

            Route::middleware('api')
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/public.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'admin' => AdminMiddleware::class,
        ]);

        $middleware->redirectGuestsTo(fn () => route('tenant.login'));

        $middleware->redirectUsersTo(fn (Request $request) => $request->user()?->is_admin
            ? route('admin.dashboard')
            : route('tenant.dashboard')
        );
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
