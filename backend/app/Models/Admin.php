<?php

namespace App\Models;

class Admin extends User
{
    protected $collection = 'admins';

    protected $attributes = [
        'role' => 'admin',
        'status' => 'active',
    ];
}
