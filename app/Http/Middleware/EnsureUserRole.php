<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();

        if (!$user) {
            abort(403, 'Unauthorized.');
        }

        if (!in_array($user->role, $roles, true)) {
            abort(403, 'Forbidden.');
        }

        return $next($request);
    }
}
