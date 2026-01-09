<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;

class ReverbConfigController extends ApiController
{
    public function __invoke(): JsonResponse
    {
        return $this->apiSuccess([
            'key' => config('broadcasting.connections.reverb.key'),
            'host' => config('broadcasting.connections.reverb.options.host'),
            'port' => (int) config('broadcasting.connections.reverb.options.port'),
            'scheme' => config('broadcasting.connections.reverb.options.scheme'),
        ]);
    }
}
