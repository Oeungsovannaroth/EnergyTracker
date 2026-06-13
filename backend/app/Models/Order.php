<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Order extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'orders';

    protected $fillable = [
        'order_number',
        'customer',
        'email',
        'product',
        'amount',
        'status',
        'history',
        'user_id',
        'meta',
    ];

    protected $attributes = [
        'status' => 'pending',
        'history' => [],
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'float',
        ];
    }
}
