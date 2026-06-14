<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Category extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'categories';

    protected $fillable = [
        'parent_id',
        'name',
        'slug',
        'type',
        'path',
        'description',
        'sort_order',
        'is_published',
    ];

    protected $attributes = [
        'sort_order' => 0,
        'is_published' => true,
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_published' => 'boolean',
        ];
    }
}
