<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Blog extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'blogs';

    protected $fillable = [
        'category_id',
        'author_id',
        'title',
        'slug',
        'content',
        'thumbnail',
        'views',
        'status',
    ];

    protected $attributes = [
        'views' => 0,
        'status' => 'draft',
    ];

    protected function casts(): array
    {
        return [
            'views' => 'integer',
        ];
    }
}
