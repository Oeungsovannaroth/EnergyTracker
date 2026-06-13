<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Media extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'media';

    protected $fillable = [
        'author_id',
        'type',
        'title',
        'description',
        'thumbnail',
        'media_url',
        'duration',
    ];
}
