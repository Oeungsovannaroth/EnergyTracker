<?php

namespace App\Http\Controllers\Api;

use App\Models\AnalyticsSnapshot;
use App\Models\ContentItem;
use App\Models\Order;
use App\Services\InvoiceService;
use App\Services\TelegramService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicContentController extends ApiController
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['nullable', 'string', 'max:80'],
        ]);

        $query = ContentItem::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->latest();

        if (! empty($validated['type'])) {
            $query->where('type', $validated['type']);
        }

        return $this->success($query->get()->map(fn (ContentItem $item) => $this->contentPayload($item)));
    }

    public function home(): JsonResponse
    {
        $latestAnalytics = AnalyticsSnapshot::orderBy('created_at', 'desc')->first();
        $featured = ContentItem::query()
            ->where('type', 'product')
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (ContentItem $item) => $this->contentPayload($item));

        return $this->success([
            'stats' => [
                [
                    'value' => '2.8 GW',
                    'label' => 'Solar Target by 2030',
                ],
                [
                    'value' => '5.5',
                    'label' => 'kWh/m2/day Avg. Irradiance',
                ],
                [
                    'value' => $latestAnalytics ? round($latestAnalytics->growth_rate).'%' : '28%',
                    'label' => 'YoY Market Growth',
                ],
                [
                    'value' => '150+',
                    'label' => 'Projects Completed',
                ],
            ],
            'featured' => $featured,
        ]);
    }

    public function products(): JsonResponse
    {
        $products = ContentItem::query()
            ->where('type', 'product')
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (ContentItem $item) => $this->contentPayload($item));

        return $this->success($products);
    }

    public function product(ContentItem $product): JsonResponse
    {
        if ($product->type !== 'product' || ! $product->is_published) {
            abort(404);
        }

        return $this->success($this->contentPayload($product));
    }

    public function purchase(
        Request $request,
        ContentItem $product,
        InvoiceService $invoices,
        TelegramService $telegram
    ): JsonResponse {
        if ($product->type !== 'product' || ! $product->is_published) {
            abort(404);
        }

        $validated = $request->validate([
            'customer' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:80'],
            'company' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:20'],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $meta = $this->metaPayload($product);
        $quantity = $validated['quantity'] ?? 1;
        $unitPrice = (float) ($meta['price'] ?? 0);
        $amount = round($unitPrice * $quantity, 2);

        $order = Order::create([
            'order_number' => $this->nextOrderNumber(),
            'customer' => $validated['customer'],
            'email' => $validated['email'],
            'product' => $quantity > 1 ? "{$product->title} x {$quantity}" : $product->title,
            'amount' => $amount,
            'status' => 'pending',
            'history' => [
                [
                    'status' => 'pending',
                    'at' => now()->toISOString(),
                    'note' => 'Public shop purchase request created.',
                ],
            ],
            'user_id' => null,
            'meta' => [
                'product_id' => (string) $product->getKey(),
                'unit_price' => $unitPrice,
                'quantity' => $quantity,
                'phone' => $validated['phone'] ?? null,
                'company' => $validated['company'] ?? null,
                'address' => $validated['address'] ?? null,
                'note' => $validated['note'] ?? null,
            ],
        ]);

        $invoice = $invoices->generateForOrder($order);

        $telegram->send('New shop purchase', "{$order->order_number} for {$order->customer} requested {$product->title}.", [
            'type' => 'shop_purchase_created',
            'order_id' => (string) $order->getKey(),
            'invoice_id' => (string) $invoice->getKey(),
            'product_id' => (string) $product->getKey(),
        ]);

        return $this->success([
            'order' => $order,
            'invoice' => $invoice,
        ], 'Purchase request created.', 201);
    }

    private function contentPayload(ContentItem $item): array
    {
        $meta = $this->metaPayload($item);

        return [
            'id' => (string) $item->getKey(),
            'type' => $item->type,
            'title' => $item->title,
            'desc' => $item->desc,
            'category_id' => $item->category_id,
            'category' => $item->category,
            'image' => $item->image,
            'image_url' => $this->publicMediaUrl($item->image),
            'link' => $item->link,
            'price' => $meta['price'] ?? null,
            'currency' => $meta['currency'] ?? 'USD',
            'features' => $meta['features'] ?? [],
            'specs' => $meta['specs'] ?? [],
            'meta' => $meta,
        ];
    }

    private function nextOrderNumber(): string
    {
        return 'ORD-'.now()->format('ymd').'-'.str_pad((string) (Order::count() + 1), 4, '0', STR_PAD_LEFT);
    }

    private function metaPayload(ContentItem $item): array
    {
        $meta = $item->meta ?? [];

        if (is_string($meta)) {
            return json_decode($meta, true) ?: [];
        }

        return is_array($meta) ? $meta : [];
    }

}
