<?php

namespace App\Jobs;

use App\Services\Whatsap\WhatsapService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SentLoginToUser implements ShouldQueue
{
    use Queueable;

    public string $phone;
    public string $name;
    public string $email;
    public string $plainPassword;

    /**
     * Create a new job instance.
     */
    public function __construct(string $phone, string $name, string $email, string $plainPassword)
    {
        $this->phone = $phone;
        $this->name = $name;
        $this->email = $email;
        $this->plainPassword = $plainPassword;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $service = app(WhatsapService::class);
            $message = sprintf(
                "🎓 *Chave da virada*\n\nOlá %s! Seu acesso foi criado com sucesso.\n\n📧 Email: %s\n🔐 Senha: %s\n\n👉 Acesse: https://estudo.gestordigitalab.com.br/login\n\n⚠️ No primeiro acesso você deverá definir uma nova senha.",
                $this->name,
                $this->email,
                $this->plainPassword
            );
            $service->sendMessage($this->phone, null, $message);
        } catch (\Throwable $exception) {
            Log::error('Falha ao enviar WhatsApp de login', [
                'phone' => $this->phone,
                'email' => $this->email,
                'exception' => $exception->getMessage(),
            ]);
        }
    }
}
