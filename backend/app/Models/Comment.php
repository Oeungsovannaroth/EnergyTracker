<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Comment extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'comments';

    protected $fillable = [
        'blog_id',
        'user_id',
        'comment',
    ];
}
