<?php

namespace Database\Seeders;

use App\Models\AnalyticsSnapshot;
use App\Models\ContentItem;
use App\Models\Invoice;
use App\Models\Notification;
use App\Models\Order;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->delete();
        Order::query()->delete();
        Invoice::query()->delete();
        Notification::query()->delete();
        AnalyticsSnapshot::query()->delete();
        SystemSetting::query()->delete();
        ContentItem::query()->delete();

        $admin = User::create([
            'name' => 'Solar Admin',
            'email' => 'admin@solarops.test',
            'password' => 'password123',
            'role' => 'admin',
            'status' => 'active',
            'company' => 'SolarOps Energy',
        ]);

        User::create([
            'name' => 'Dara Kim',
            'email' => 'dara@example.com',
            'password' => 'password123',
            'role' => 'user',
            'status' => 'active',
            'company' => 'Sokha Solar Co.',
        ]);

        $orders = [
            ['ORD-1028', 'Sokha Solar Co.', 'ops@sokhasolar.com', 'Commercial monitoring plan', 12800, 'completed'],
            ['ORD-1027', 'Angkor Energy', 'finance@angkor.energy', 'Grid analytics bundle', 9200, 'processing'],
            ['ORD-1026', 'Blue Mekong', 'admin@bluemekong.io', 'Monthly data subscription', 3800, 'pending'],
            ['ORD-1025', 'SunRise Microgrid', 'hello@sunrisemicrogrid.com', 'Invoice automation', 6400, 'completed'],
        ];

        foreach ($orders as [$number, $customer, $email, $product, $amount, $status]) {
            $order = Order::create([
                'order_number' => $number,
                'customer' => $customer,
                'email' => $email,
                'product' => $product,
                'amount' => $amount,
                'status' => $status,
                'user_id' => (string) $admin->getKey(),
                'history' => [
                    ['status' => $status, 'at' => now()->toISOString(), 'note' => 'Seeded order.'],
                ],
            ]);

            Invoice::create([
                'invoice_number' => 'INV-'.substr($number, 4),
                'order_id' => (string) $order->getKey(),
                'order_number' => $number,
                'customer' => $customer,
                'email' => $email,
                'subtotal' => $amount,
                'tax' => round($amount * 0.1, 2),
                'total' => round($amount * 1.1, 2),
                'status' => $status === 'completed' ? 'paid' : 'sent',
                'due_date' => now()->addDays(14),
                'items' => [
                    ['description' => $product, 'quantity' => 1, 'unit_price' => $amount, 'total' => $amount],
                ],
            ]);
        }

        foreach ([
            ['Jan', 18500, 96, 420],
            ['Feb', 22400, 121, 520],
            ['Mar', 31200, 148, 670],
            ['Apr', 28600, 139, 710],
            ['May', 37800, 181, 830],
            ['Jun', 42100, 212, 940],
        ] as [$month, $revenue, $ordersCount, $usersCount]) {
            AnalyticsSnapshot::create([
                'month' => $month,
                'revenue' => $revenue,
                'orders' => $ordersCount,
                'users' => $usersCount,
                'active_users' => (int) round($usersCount * 0.92),
                'growth_rate' => 12.5,
            ]);
        }

        SystemSetting::create(['key' => 'telegram_enabled', 'value' => true, 'group' => 'notifications']);
        SystemSetting::create(['key' => 'invoice_tax_rate', 'value' => 10, 'group' => 'billing']);
        SystemSetting::create(['key' => 'default_role', 'value' => 'user', 'group' => 'security']);

        Notification::create([
            'type' => 'system',
            'title' => 'Seeder completed',
            'message' => 'Initial MongoDB dashboard records were created.',
            'status' => 'sent',
        ]);

        foreach ($this->contentItems() as $item) {
            ContentItem::create($item);
        }

        $this->call(CmsSeeder::class);
    }

    private function contentItems(): array
    {
        return [
            [
                'type' => 'product',
                'title' => 'Residential 5kW Rooftop Solar Kit',
                'desc' => 'A complete grid-tied rooftop package for homes and small offices, including panels, inverter, mounting, monitoring, and installation guidance.',
                'category' => 'Home Solar',
                'image' => 'https://www.apolloenergy.nz/assets/blog/how-much-power-does-a-5kw-solar-system-produce-hero.jpg',
                'sort_order' => 1,
                'meta' => [
                    'price' => 4200,
                    'currency' => 'USD',
                    'features' => ['5kW solar array', 'Hybrid-ready inverter', 'Mobile performance monitoring', 'Installation checklist'],
                    'specs' => ['Recommended roof area: 28-34 m2', 'Estimated output: 18-24 kWh/day', 'Warranty: 10 years inverter, 25 years panels'],
                ],
            ],
            [
                'type' => 'product',
                'title' => 'Commercial Solar Monitoring Plan',
                'desc' => 'Monthly monitoring and reporting for factories, schools, and commercial rooftops that need clear performance and savings visibility.',
                'category' => 'Monitoring',
                'image' => 'https://www.khmertimeskh.com/wp-content/uploads/2026/03/Metfone-1-Main.jpg',
                'sort_order' => 2,
                'meta' => [
                    'price' => 380,
                    'currency' => 'USD',
                    'features' => ['Monthly production report', 'Fault alerts', 'Savings dashboard', 'Engineer review call'],
                    'specs' => ['Best for: 20kW-500kW systems', 'Billing: monthly', 'Setup time: 3-5 business days'],
                ],
            ],
            [
                'type' => 'product',
                'title' => 'Solar Farm Feasibility Study',
                'desc' => 'A developer-ready feasibility package covering site yield, grid access, capex assumptions, permitting risks, and financial returns.',
                'category' => 'Consulting',
                'image' => 'https://www.cenergi-sea.com/wp-content/uploads/2021/05/irms_01.jpg',
                'sort_order' => 3,
                'meta' => [
                    'price' => 6800,
                    'currency' => 'USD',
                    'features' => ['Solar yield estimate', 'Grid connection review', 'Financial model', 'Investor-ready summary'],
                    'specs' => ['Best for: 1MW-50MW sites', 'Delivery: 3-4 weeks', 'Includes: 2 revision rounds'],
                ],
            ],
            [
                'type' => 'featured',
                'title' => 'Cambodia Solar Roadmap 2026-2030',
                'desc' => 'Updated targets, new incentives, and priority provinces for development.',
                'category' => 'Policy',
                'image' => 'https://www.undp.org/sites/g/files/zskgke326/files/styles/scaled_image_large/public/migration/kh/UNDP_KH_Promoting-The-Use-Of-Solar-Technologies-.jpg?itok=th1paWzE',
                'sort_order' => 1,
            ],
            [
                'type' => 'featured',
                'title' => 'Rooftop Solar Guide for Cambodian Homes & SMEs',
                'desc' => 'Technical specifications optimized for tropical climate and grid conditions.',
                'category' => 'Engineering',
                'image' => 'https://www.khmertimeskh.com/wp-content/uploads/2026/03/Metfone-1-Main.jpg',
                'sort_order' => 2,
            ],
            [
                'type' => 'featured',
                'title' => '5MW Solar Farm in Siem Reap - Full Case Study',
                'desc' => '94% performance ratio achieved. Lessons learned and financial returns.',
                'category' => 'Case Study',
                'image' => 'https://www.cenergi-sea.com/wp-content/uploads/2021/05/irms_01.jpg',
                'sort_order' => 3,
            ],
            [
                'type' => 'blog',
                'title' => "Cambodia's Solar Potential: Opportunities in 2026",
                'desc' => 'Analysis of latest policies and investment opportunities.',
                'category' => 'Case Studies',
                'sort_order' => 1,
            ],
            [
                'type' => 'blog',
                'title' => 'From Coal to Solar: Just Energy Transition in SE Asia',
                'desc' => 'Challenges and success stories from the region.',
                'category' => 'Opinion',
                'sort_order' => 2,
            ],
            [
                'type' => 'blog',
                'title' => 'Rooftop Solar Economics in Phnom Penh',
                'desc' => 'Real payback numbers from recent installations.',
                'category' => 'Energy Transition',
                'sort_order' => 3,
            ],
        ];
    }
}
