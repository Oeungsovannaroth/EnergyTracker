<?php

namespace App\Http\Controllers\Api;

use App\Models\Invoice;
use App\Services\InvoiceService;
use App\Services\TelegramService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class InvoiceController extends ApiController
{
    public function index(): JsonResponse
    {
        return $this->success(Invoice::latest()->paginate(10));
    }

    public function show(Invoice $invoice): JsonResponse
    {
        return $this->success($invoice);
    }

    public function download(Invoice $invoice, InvoiceService $service): BinaryFileResponse
    {
        $path = $service->storePdf($invoice);

        return response()->download(storage_path("app/{$path}"));
    }

    public function sendToTelegram(Invoice $invoice, TelegramService $telegram): JsonResponse
    {
        $notification = $telegram->send('Invoice generated', "{$invoice->invoice_number} total: $".number_format($invoice->total, 2), [
            'type' => 'invoice_generated',
            'invoice_id' => (string) $invoice->getKey(),
        ]);

        return $this->success($notification, 'Invoice sent to Telegram.');
    }
}
