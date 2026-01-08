<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('revisao configuracao page can be rendered', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('estudos.revisao.configuracao'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Revisao/configuracao/index')
    );
});
