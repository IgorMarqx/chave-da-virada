<?php

namespace App\Events;

use App\Models\Arquivo;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ArquivoProcessado implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Arquivo $arquivo,
        public int $userId
    ) {
        Log::info('Evento ArquivoProcessado criado.', [
            'arquivo_id' => $this->arquivo->id,
            'user_id' => $this->userId,
            'topico_id' => $this->arquivo->topico_id,
        ]);
    }

    public function broadcastOn(): array
    {
        Log::info('Broadcasting ArquivoProcessado.', [
            'channel' => "arquivos.{$this->userId}",
            'arquivo_id' => $this->arquivo->id,
        ]);

        return [
            new PrivateChannel("arquivos.{$this->userId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'arquivo.processado';
    }

    public function broadcastWith(): array
    {
        return [
            'arquivo_id' => $this->arquivo->id,
            'topico_id' => $this->arquivo->topico_id,
        ];
    }
}
