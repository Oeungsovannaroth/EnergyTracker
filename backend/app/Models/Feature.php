<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Feature extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'features';

    protected $fillable = [
        'article_id',
        'title',
        'description',
        'image',
    ];
}
