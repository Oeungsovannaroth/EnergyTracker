<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Publication extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'publications';

    protected $fillable = [
        'author_id',
        'title',
        'description',
        'publication_type',
        'file_url',
        'download_count',
    ];

    protected $attributes = [
        'download_count' => 0,
    ];

    protected function casts(): array
    {
        return [
            'download_count' => 'integer',
        ];
    }
}
