<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Article extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'articles';

    protected $fillable = [
        'category_id',
        'country_id',
        'author_id',
        'title',
        'slug',
        'summary',
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
