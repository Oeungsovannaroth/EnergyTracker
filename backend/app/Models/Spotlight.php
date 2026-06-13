<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Spotlight extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'spotlights';

    protected $fillable = [
        'country_id',
        'title',
        'content',
        'thumbnail',
        'status',
    ];

    protected $attributes = [
        'status' => true,
    ];

    protected function casts(): array
    {
        return [
            'status' => 'boolean',
        ];
    }
}
