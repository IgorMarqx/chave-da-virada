<?php

namespace App\Services;

use App\Models\Arquivo;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ArquivosService
{
    public function listByTopicoForUser(int $topicoId, int $userId)
    {
        return Arquivo::query()
            ->where('topico_id', $topicoId)
            ->where('user_id', $userId)
            ->latest()
            ->get();
    }

    public function storeForUser(int $userId, int $topicoId, string $tipo, UploadedFile $file): Arquivo
    {
        $path = $file->storePublicly("topicos/{$topicoId}/{$userId}", 's3');
        $url = Storage::disk('s3')->url($path);

        return Arquivo::create([
            'user_id' => $userId,
            'topico_id' => $topicoId,
            'nome_original' => $file->getClientOriginalName(),
            'tipo' => $tipo,
            'path' => $url,
            'tamanho_bytes' => $file->getSize(),
            'hash_sha256' => hash_file('sha256', $file->getRealPath()),
            'metadata' => [
                'mime' => $file->getClientMimeType(),
                'extension' => $file->getClientOriginalExtension(),
                's3_key' => $path,
            ],
        ]);
    }

    public function deleteForUser(Arquivo $arquivo): void
    {
        $key = $arquivo->metadata['s3_key'] ?? null;
        if (!$key) {
            $url = $arquivo->path;
            $key = $this->resolveKeyFromUrl($url);
        }

        if ($key) {
            Storage::disk('s3')->delete($key);
        }

        $arquivo->delete();
    }

    private function resolveKeyFromUrl(?string $url): ?string
    {
        if (!$url) {
            return null;
        }

        $path = parse_url($url, PHP_URL_PATH);
        if (!$path) {
            return null;
        }

        return ltrim($path, '/');
    }
}
