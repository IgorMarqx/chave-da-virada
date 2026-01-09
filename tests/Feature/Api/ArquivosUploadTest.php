<?php

use App\Jobs\ProcessArquivoUpload;
use App\Models\Concurso;
use App\Models\Disciplina;
use App\Models\Topico;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

it('queues arquivo upload and returns accepted', function () {
    Queue::fake();
    Storage::fake('local');

    $user = User::factory()->create();
    $concurso = Concurso::factory()->create(['user_id' => $user->id]);
    $disciplina = Disciplina::factory()->create([
        'user_id' => $user->id,
        'concurso_id' => $concurso->id,
    ]);
    $topico = Topico::factory()->create([
        'user_id' => $user->id,
        'disciplina_id' => $disciplina->id,
    ]);

    $response = $this
        ->actingAs($user)
        ->withoutMiddleware('jwt.auth')
        ->post('/api/arquivos', [
            'topico_id' => $topico->id,
            'tipo' => 'pdf',
            'file' => UploadedFile::fake()->create('teste.pdf', 100, 'application/pdf'),
        ]);

    $response->assertStatus(202)
        ->assertJsonPath('success', true);

    Queue::assertPushed(ProcessArquivoUpload::class, function (ProcessArquivoUpload $job) use ($user, $topico) {
        expect($job->userId)->toBe($user->id);
        expect($job->topicoId)->toBe($topico->id);
        expect($job->tipo)->toBe('pdf');
        expect($job->nomeOriginal)->toBe('teste.pdf');

        Storage::disk('local')->assertExists($job->tempPath);

        return true;
    });
});
