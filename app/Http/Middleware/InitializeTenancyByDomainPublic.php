<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
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
            }
        }

        return $next($request);
    }
}
