<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Invoice extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'invoices';

    protected $fillable = [
        'invoice_number',
        'order_id',
        'order_number',
        'customer',
        'email',
        'subtotal',
        'tax',
        'total',
        'status',
        'due_date',
        'items',
    ];

    protected $attributes = [
        'status' => 'draft',
        'items' => [],
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'float',
            'tax' => 'float',
            'total' => 'float',
            'due_date' => 'datetime',
        ];
    }
}
