<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class AnalyticsSnapshot extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'analytics';

    protected $fillable = [
        'month',
        'revenue',
        'orders',
        'users',
        'active_users',
        'growth_rate',
    ];

    protected function casts(): array
    {
        return [
            'revenue' => 'float',
            'orders' => 'integer',
            'users' => 'integer',
            'active_users' => 'integer',
            'growth_rate' => 'float',
        ];
    }
}
