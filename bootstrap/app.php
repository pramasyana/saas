<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\InitializeTenancyByDomainPublic;
use App\Http\Middleware\InitializeTenancyByUser;
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
            $centralDomains = config('tenancy.central_domains', []);
            $isCentral = in_array(request()->getHost(), $centralDomains);

            Route::middleware('web')
                ->group(base_path('routes/web.php'));

            Route::middleware('web')
                ->group(base_path('routes/web/admin.php'));

            Route::middleware('web')
                ->group(base_path('routes/web/auth.php'));

            Route::middleware(['web', 'auth', 'tenant'])
                ->group(base_path('routes/web/tenant.php'));

            Route::middleware(['web', 'auth', 'tenant'])
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/tenant/staff.php'));

            Route::middleware(['web', 'auth', 'tenant'])
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/tenant/company.php'));

            Route::middleware(['web', 'auth', 'tenant'])
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/tenant/crm.php'));

            Route::middleware(['web', 'auth', 'tenant'])
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/tenant/service.php'));

            Route::middleware(['web', 'auth', 'tenant'])
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/tenant/booking.php'));

            Route::middleware(['web', 'auth', 'tenant'])
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/tenant/setting.php'));

            Route::middleware(['web', 'auth', 'tenant'])
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/tenant/notification.php'));

            Route::middleware(['web', 'auth', 'tenant'])
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/tenant/profile.php'));

            // Public tenant routes — registered AFTER auth routes so they take
            // priority on tenant domains. The public controller handles
            // redirecting authenticated users to the admin booking page.
            if (! $isCentral) {
                Route::middleware(['web', 'tenant.domain.public'])
                    ->group(base_path('routes/web/tenant_public.php'));

                Route::middleware(['api', 'tenant.domain.public'])
                    ->prefix('api/v1')
                    ->group(base_path('routes/api/v1/tenant_public.php'));
            }

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

            Route::middleware('web')
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/admin/settings.php'));

            Route::middleware('web')
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/admin/profile.php'));

            Route::middleware('web')
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/admin/activity.php'));

            Route::middleware('web')
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/admin/system.php'));

            Route::middleware('web')
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/admin/notifications.php'));

            Route::middleware('web')
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/admin/audit-logs.php'));

            Route::middleware('web')
                ->prefix('api/v1')
                ->group(base_path('routes/api/v1/admin/tenant-notifications.php'));

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
            'tenant' => InitializeTenancyByUser::class,
            'tenant.domain.public' => InitializeTenancyByDomainPublic::class,
        ]);

        $middleware->redirectGuestsTo(fn () => route('tenant.login'));

        $middleware->redirectUsersTo(fn (Request $request) => $request->user()?->is_admin
            ? route('admin.dashboard')
            : (Route::has('tenant.dashboard') ? route('tenant.dashboard') : '/')
        );
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
