<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Notification extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'notifications';

    protected $fillable = [
        'type',
        'channel',
        'title',
        'message',
        'status',
        'payload',
    ];

    protected $attributes = [
        'channel' => 'telegram',
        'status' => 'queued',
        'payload' => [],
    ];

    protected function casts(): array
    {
        return [];
    }
}
