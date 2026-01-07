<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsurePasswordReset
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || !$user->must_reset_password) {
            return $next($request);
        }

        if (
            $request->routeIs('first-access-password')
            || $request->routeIs('user-password.update')
        ) {
            return $next($request);
        }

        return redirect()->route('first-access-password');
    }
}
