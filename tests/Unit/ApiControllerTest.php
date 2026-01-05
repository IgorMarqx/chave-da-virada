<?php

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

uses(TestCase::class);

beforeEach(function () {
    Route::get('/_test/api-success', function () {
        $controller = new class extends ApiController
        {
            public function handle(): JsonResponse
            {
                return $this->apiSuccess(['token' => 'abc123'], 'Created', 201);
            }
        };

        return $controller->handle();
    });

    Route::get('/_test/api-error', function () {
        $controller = new class extends ApiController
        {
            public function handle(): JsonResponse
            {
                return $this->apiError('Invalid', ['email' => ['Required']], 422);
            }
        };

        return $controller->handle();
    });
});

it('returns a standardized success response', function () {
    $response = $this->getJson('/_test/api-success');

    $response->assertCreated();
    $response->assertJson([
        'success' => true,
        'message' => 'Created',
        'data' => ['token' => 'abc123'],
        'errors' => null,
    ]);
});

it('returns a standardized error response', function () {
    $response = $this->getJson('/_test/api-error');

    $response->assertUnprocessable();
    $response->assertJson([
        'success' => false,
        'message' => 'Invalid',
        'data' => null,
        'errors' => ['email' => ['Required']],
    ]);
});
