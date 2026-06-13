<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class SystemSetting extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'system_settings';

    protected $fillable = [
        'key',
        'value',
        'group',
        'is_secret',
    ];

    protected function casts(): array
    {
        return [
            'is_secret' => 'boolean',
        ];
    }
}
