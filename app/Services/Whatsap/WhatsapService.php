<?php

namespace App\Services\Whatsap;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsapService
{
    /**
     * @throws ConnectionException
     */

    public function sendMessage($phone, $mediaUrl, string $message, ?string $fileName = null): void
    {
        try {
            $phone = $this->validateAndFormatPhone($phone);

            Log::info('Enviando mensagem WhatsApp', [
                'phone' => $phone,
                'mediaUrl' => $mediaUrl,
                'file_name' => $fileName,
            ]);

            $url = env('GZAPPY_URL');
            $key = env('GZAPPY_API_KEY');

            $url_anchor = 'message/send-text';

            $data = [
                'message' => $message,
                'phone' => [$phone],
            ];

            if (!empty($mediaUrl)) {
                $url_anchor = 'message/send-media';
                $data['media_public_url'] = $mediaUrl;
                if (!empty($fileName)) {
                    $data['file_name'] = $fileName;
                }
            }

            Log::info('tipo da mensagem' . $url_anchor);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $key,
            ])->post($url . $url_anchor, $data);

            if ($response->failed()) {
                Log::error('Erro ao enviar mensagem WhatsApp', [
                    'phone' => $phone,
                    'status' => $response->status(),
                    'response' => $response->body(),
                    'data' => $data,
                ]);
            }
        } catch (RequestException $e) {
            Log::error('Erro ao fazer requisição para enviar mensagem WhatsApp', [
                'phone' => $phone,
                'exception_message' => $e->getMessage(),
            ]);
        }
    }

    public function validateAndFormatPhone($phone): string
    {
        Log::info('Validando e formatando número de telefone', [
            'phone' => $phone,
        ]);

        // Remover todos os caracteres não numéricos
        $phone = preg_replace('/\D/', '', $phone);

        // Verificar se o número começa com '55' e é válido para a região 83
        //        if (substr($phone, 0, 2) === '55' && substr($phone, 2, 2) === '83' && substr($phone, 4, 1) !== '9') {
        //            $phone = substr($phone, 0, 4) . '9' . substr($phone, 4);
        //        }

        // Garantir que o número começa com '55839'
        if (!str_starts_with($phone, '55')) {
            $phone = '55' . $phone;
        }

        // Verifica se o número tem 13 caracteres (o tamanho correto)
        if (strlen($phone) === 13) {
            return $phone;
        }

        // Caso o número seja inválido, loga o erro sem lançar exceção
        Log::warning('Número de telefone inválido', [
            'phone' => $phone,
        ]);

        // Retorna um valor padrão (como uma string vazia ou um valor nulo)
        return ''; // ou return null; dependendo da lógica do seu sistema
    }

    public function sendTextMessage($phones, string $message): void
    {
        try {
            $phones = is_array($phones) ? $phones : [$phones];

            foreach ($phones as $phone) {
                $formattedPhone = $this->validateAndFormatPhone($phone);

                Log::info('Enviando mensagem WhatsApp', [
                    'phone' => $formattedPhone
                ]);

                $url = env('GZAPPY_URL', "https://v2-api.gzappy.com/");
                $key = env('GZAPPY_API_KEY');

                $url_anchor = 'message/send-text';

                $data = [
                    'message' => $message,
                    'phone' => [$formattedPhone],
                ];

                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer ' . $key,
                ])->post($url . $url_anchor, $data);

                if ($response->failed()) {
                    Log::error('Erro ao enviar mensagem WhatsApp', [
                        'phone' => $formattedPhone,
                        'status' => $response->status(),
                        'response' => $response->body(),
                        'data' => $data,
                    ]);
                }
            }
        } catch (RequestException $e) {
            Log::error('Erro ao fazer requisição para enviar mensagem WhatsApp', [
                'exception_message' => $e->getMessage(),
            ]);
        }
    }
}
