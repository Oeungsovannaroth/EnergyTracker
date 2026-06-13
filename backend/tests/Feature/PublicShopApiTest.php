<?php

namespace Tests\Feature;

use App\Models\ContentItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicShopApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_user_can_purchase_published_product(): void
    {
        $product = ContentItem::create([
            'type' => 'product',
            'title' => 'Residential 5kW Rooftop Solar Kit',
            'desc' => 'Complete rooftop solar package.',
            'category' => 'Home Solar',
            'image' => 'https://example.com/solar.jpg',
            'is_published' => true,
            'meta' => [
                'price' => 4200,
                'currency' => 'USD',
            ],
        ]);

        $response = $this->postJson("/api/public/products/{$product->getKey()}/purchase", [
            'customer' => 'Dara Kim',
            'email' => 'dara@example.com',
            'quantity' => 2,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.order.customer', 'Dara Kim')
            ->assertJsonPath('data.order.product', 'Residential 5kW Rooftop Solar Kit x 2')
            ->assertJsonPath('data.order.amount', 8400)
            ->assertJsonPath('data.invoice.subtotal', 8400);
    }
}
