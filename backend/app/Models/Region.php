<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Region extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'regions';

    protected $fillable = ['name', 'description'];
}
