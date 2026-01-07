<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;

class UserPasswordController extends ApiController
{
    public function update(Request $request)
    {
        $user = $request->user();
        $rules = [
            'password' => ['required', Password::defaults(), 'confirmed'],
        ];

        if (!$user->must_reset_password) {
            $rules['current_password'] = ['required', 'current_password'];
        }

        $validated = $request->validate($rules);

        $request->user()->update([
            'password' => $validated['password'],
            'must_reset_password' => false,
            'last_password_reset_at' => now(),
        ]);

        return $this->apiSuccess(null, 'Password updated successfully');
    }
}
