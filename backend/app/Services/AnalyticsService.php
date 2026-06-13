<?php

namespace App\Services;

use App\Models\AnalyticsSnapshot;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\User;

class AnalyticsService
{
    public function dashboard(): array
    {
        $users = User::count();
        $activeUsers = User::where('status', 'active')->count();
        $orders = Order::count();
        $revenue = (float) Invoice::whereIn('status', ['paid', 'sent'])->sum('total');

        return [
            'metrics' => [
                ['label' => 'Total users', 'value' => $users, 'change' => '+9.2%', 'trend' => 'up'],
                ['label' => 'Active users', 'value' => $activeUsers, 'change' => '+8.8%', 'trend' => 'up'],
                ['label' => 'Total orders', 'value' => $orders, 'change' => '+12.7%', 'trend' => 'up'],
                ['label' => 'Revenue', 'value' => $revenue, 'change' => '+18.4%', 'trend' => 'up'],
            ],
            'monthlyRevenue' => AnalyticsSnapshot::orderBy('month')->get(['month', 'revenue', 'orders', 'users']),
            'orderStatuses' => Order::raw(function ($collection) {
                return $collection->aggregate([
                    ['$group' => ['_id' => '$status', 'value' => ['$sum' => 1]]],
                    ['$project' => ['name' => '$_id', 'value' => 1, '_id' => 0]],
                ]);
            }),
            'recentActivities' => Order::latest()->limit(5)->get()->map(fn (Order $order) => "Order {$order->order_number} is {$order->status}."),
            'topCustomers' => Order::raw(function ($collection) {
                return $collection->aggregate([
                    ['$group' => ['_id' => '$email', 'name' => ['$first' => '$customer'], 'revenue' => ['$sum' => '$amount']]],
                    ['$sort' => ['revenue' => -1]],
                    ['$limit' => 5],
                    ['$project' => ['email' => '$_id', 'name' => 1, 'revenue' => 1, '_id' => 0]],
                ]);
            }),
        ];
    }
}
