<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class InvoiceService
{
    public function generateForOrder(Order $order): Invoice
    {
        $subtotal = (float) $order->amount;
        $tax = round($subtotal * 0.1, 2);

        return Invoice::create([
            'invoice_number' => $this->nextInvoiceNumber(),
            'order_id' => (string) $order->getKey(),
            'order_number' => $order->order_number,
            'customer' => $order->customer,
            'email' => $order->email,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $subtotal + $tax,
            'status' => 'sent',
            'due_date' => Carbon::now()->addDays(14),
            'items' => [
                [
                    'description' => $order->product,
                    'quantity' => 1,
                    'unit_price' => $subtotal,
                    'total' => $subtotal,
                ],
            ],
        ]);
    }

    public function storePdf(Invoice $invoice): string
    {
        $pdf = Pdf::loadView('pdf.invoice', ['invoice' => $invoice]);
        $path = "invoices/{$invoice->invoice_number}.pdf";

        Storage::disk('local')->put($path, $pdf->output());

        return $path;
    }

    private function nextInvoiceNumber(): string
    {
        return 'INV-'.now()->format('ymd').'-'.str_pad((string) (Invoice::count() + 1), 4, '0', STR_PAD_LEFT);
    }
}
