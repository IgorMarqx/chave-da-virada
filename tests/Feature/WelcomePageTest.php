<?php

it('renders the welcome page sections', function () {
    $response = $this->get('/');

    $response
        ->assertSuccessful()
        ->assertSee('A chave que destrava sua aprovação')
        ->assertSee('Tudo que você precisa para se organizar')
        ->assertSee('Simples de usar, poderoso nos resultados')
        ->assertSee('Histórias de sucesso')
        ->assertSee('Invista no seu futuro')
        ->assertSee('Pronto para destravar sua aprovação?');
});
