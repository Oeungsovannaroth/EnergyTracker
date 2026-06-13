<?php

namespace App\Services;

use App\Models\Notification;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    public function send(string $title, string $message, array $payload = []): Notification
    {
        $notification = Notification::create([
            'type' => $payload['type'] ?? 'system',
            'title' => $title,
            'message' => $message,
            'payload' => $payload,
            'status' => 'queued',
        ]);

        $token = config('services.telegram.bot_token');
        $chatId = config('services.telegram.chat_id');

        if (! $token || ! $chatId) {
            $notification->update(['status' => 'skipped']);

            return $notification;
        }

        try {
            $response = Http::timeout(8)->post("https://api.telegram.org/bot{$token}/sendMessage", [
                'chat_id' => $chatId,
                'text' => "{$title}\n{$message}",
                'parse_mode' => 'HTML',
            ]);

            $notification->update([
                'status' => $response->successful() ? 'sent' : 'failed',
                'payload' => [...$payload, 'telegram_response' => $response->json()],
            ]);
        } catch (\Throwable $exception) {
            Log::warning('Telegram notification failed.', [
                'message' => $exception->getMessage(),
            ]);

            $notification->update([
                'status' => 'failed',
                'payload' => [...$payload, 'error' => $exception->getMessage()],
            ]);
        }

        return $notification;
    }
}
