<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Page extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'pages';

    protected $fillable = [
        'parent_path',
        'path',
        'slug',
        'title',
        'description',
        'content',
        'image',
        'category',
        'category_id',
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
