<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stancl\Tenancy\Database\Models\Domain;
use Symfony\Component\HttpFoundation\Response;

class InitializeTenancyByDomainPublic
{
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();

        $domain = Domain::where('domain', $host)->first();

        if ($domain) {
            $tenant = Tenant::find($domain->tenant_id);

            if ($tenant) {
                tenancy()->initialize($tenant);
            } else {
                Log::warning('Tenant public: domain found but tenant missing', [
                    'host' => $host,
                    'domain_id' => $domain->id,
                    'tenant_id' => $domain->tenant_id,
                ]);

                abort(404, 'Tenant tidak ditemukan.');
            }
        } else {
            Log::info('Tenant public: domain not found in database', [
                'host' => $host,
            ]);
        }

        return $next($request);
    }
}
