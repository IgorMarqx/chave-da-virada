<?php

test('app timezone is sao paulo', function () {
    expect(config('app.timezone'))->toBe('America/Sao_Paulo');
});
