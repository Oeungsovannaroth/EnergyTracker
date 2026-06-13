<?php

namespace App\Http\Controllers\Api;

use App\Models\ContentItem;
use App\Models\Order;
use App\Services\InvoiceService;
use App\Services\TelegramService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends ApiController
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::query()->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('email')) {
            $query->where('email', $request->string('email'));
        }

        $paginator = $query->paginate((int) $request->input('per_page', 15));
        $paginator->getCollection()->transform(fn (Order $order) => $this->enrichOrder($order));

        return $this->success($paginator);
    }

    private function enrichOrder(Order $order): array
    {
        $data = $order->toArray();
        $meta = is_array($order->meta) ? $order->meta : [];
        $productId = $meta['product_id'] ?? null;

        if ($productId) {
            $product = ContentItem::query()->find($productId);
            if ($product) {
                $productMeta = $product->meta ?? [];
                $data['product_details'] = [
                    'id' => (string) $product->getKey(),
                    'title' => $product->title,
                    'image' => $product->image,
                    'price' => $productMeta['price'] ?? null,
                    'currency' => $productMeta['currency'] ?? 'USD',
                ];
            }
        }

        $data['quantity'] = $meta['quantity'] ?? 1;
        $data['unit_price'] = $meta['unit_price'] ?? null;

        return $data;
    }

    public function store(Request $request, InvoiceService $invoices, TelegramService $telegram): JsonResponse
    {
        $validated = $request->validate([
            'customer' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'product' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'status' => ['nullable', 'in:pending,processing,completed,cancelled'],
        ]);

        $order = Order::create([
            ...$validated,
            'order_number' => 'ORD-'.now()->format('ymd').'-'.str_pad((string) (Order::count() + 1), 4, '0', STR_PAD_LEFT),
            'user_id' => (string) $request->user()->getKey(),
            'history' => [
                ['status' => $validated['status'] ?? 'pending', 'at' => now()->toISOString(), 'note' => 'Order created.'],
            ],
        ]);

        $invoice = $invoices->generateForOrder($order);
        $telegram->send('New order created', "{$order->order_number} for {$order->customer} generated {$invoice->invoice_number}.", [
            'type' => 'order_created',
            'order_id' => (string) $order->getKey(),
            'invoice_id' => (string) $invoice->getKey(),
        ]);

        return $this->success(['order' => $order, 'invoice' => $invoice], 'Order created.', 201);
    }

    public function update(Request $request, Order $order, TelegramService $telegram): JsonResponse
    {
        $validated = $request->validate([
            'customer' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email'],
            'product' => ['sometimes', 'string', 'max:255'],
            'amount' => ['sometimes', 'numeric', 'min:0'],
            'status' => ['sometimes', 'in:pending,processing,completed,cancelled'],
        ]);

        if (isset($validated['status']) && $validated['status'] !== $order->status) {
            $history = $order->history ?? [];
            $history[] = ['status' => $validated['status'], 'at' => now()->toISOString(), 'note' => 'Status updated.'];
            $validated['history'] = $history;
        }

        $order->update($validated);

        if (isset($validated['status'])) {
            $telegram->send('Order status updated', "{$order->order_number} is now {$order->status}.", [
                'type' => 'order_status_updated',
                'order_id' => (string) $order->getKey(),
            ]);
        }

        return $this->success($order->fresh(), 'Order updated.');
    }

    public function destroy(Order $order): JsonResponse
    {
        $order->delete();

        return $this->success(null, 'Order deleted.');
    }
}
