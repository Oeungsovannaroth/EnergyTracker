<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ContentItem extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'content_items';

    protected $fillable = [
        'type',
        'title',
        'desc',
        'category_id',
        'category',
        'image',
        'link',
        'meta',
        'sort_order',
        'is_published',
    ];

    protected $attributes = [
        'meta' => [],
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
