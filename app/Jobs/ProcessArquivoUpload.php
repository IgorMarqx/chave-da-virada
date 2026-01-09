<?php

namespace App\Jobs;

use App\Events\ArquivoProcessado;
use App\Models\Arquivo;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Http\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class ProcessArquivoUpload implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public int $userId,
        public int $topicoId,
        public string $tipo,
        public string $tempPath,
        public string $nomeOriginal
    ) {}

    public function handle(): void
    {
        $localDisk = Storage::disk('local');
        if (! $localDisk->exists($this->tempPath)) {
            throw new RuntimeException('Arquivo temporario nao encontrado para upload.');
        }

        $localPath = $localDisk->path($this->tempPath);
        $file = new File($localPath);
        $extension = pathinfo($this->nomeOriginal, PATHINFO_EXTENSION);
        $storedName = Str::uuid().($extension ? ".{$extension}" : '');
        $directory = "topicos/{$this->topicoId}/{$this->userId}";

        $s3Path = Storage::disk('s3')->putFileAs(
            $directory,
            $file,
            $storedName,
            ['visibility' => 'public']
        );

        if (! $s3Path) {
            throw new RuntimeException('Falha ao enviar arquivo para o S3.');
        }

        $arquivo = Arquivo::create([
            'user_id' => $this->userId,
            'topico_id' => $this->topicoId,
            'nome_original' => $this->nomeOriginal,
            'tipo' => $this->tipo,
            'path' => Storage::disk('s3')->url($s3Path),
            'tamanho_bytes' => $file->getSize(),
            'hash_sha256' => hash_file('sha256', $localPath),
            'metadata' => [
                'mime' => $file->getMimeType(),
                'extension' => $extension ?: null,
                's3_key' => $s3Path,
            ],
        ]);

        $localDisk->delete($this->tempPath);

        Log::info('Arquivo processado e pronto para broadcast.', [
            'arquivo_id' => $arquivo->id,
            'user_id' => $this->userId,
            'topico_id' => $this->topicoId,
        ]);

        ArquivoProcessado::dispatch($arquivo, $this->userId);
    }
}
