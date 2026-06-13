<?php

namespace Database\Seeders;

use App\Models\ContentItem;
use Illuminate\Database\Seeder;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->items() as $item) {
            ContentItem::query()->updateOrCreate(
                [
                    'type' => $item['type'],
                    'title' => $item['title'],
                ],
                $item
            );
        }
    }

    private function items(): array
    {
        return [
            [
                'type' => 'product',
                'title' => 'Residential 5kW Rooftop Solar Kit',
                'desc' => 'A complete grid-tied rooftop package for homes and small offices, including panels, inverter, mounting, monitoring, and installation guidance.',
                'category' => 'Home Solar',
                'image' => 'https://www.apolloenergy.nz/assets/blog/how-much-power-does-a-5kw-solar-system-produce-hero.jpg',
                'sort_order' => 1,
                'is_published' => true,
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
                'is_published' => true,
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
                'is_published' => true,
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
                'is_published' => true,
            ],
            [
                'type' => 'featured',
                'title' => 'Rooftop Solar Guide for Cambodian Homes & SMEs',
                'desc' => 'Technical specifications optimized for tropical climate and grid conditions.',
                'category' => 'Engineering',
                'image' => 'https://www.khmertimeskh.com/wp-content/uploads/2026/03/Metfone-1-Main.jpg',
                'sort_order' => 2,
                'is_published' => true,
            ],
            [
                'type' => 'featured',
                'title' => '5MW Solar Farm in Siem Reap - Full Case Study',
                'desc' => '94% performance ratio achieved. Lessons learned and financial returns.',
                'category' => 'Case Study',
                'image' => 'https://www.cenergi-sea.com/wp-content/uploads/2021/05/irms_01.jpg',
                'sort_order' => 3,
                'is_published' => true,
            ],
            [
                'type' => 'blog',
                'title' => "Cambodia's Solar Potential: Opportunities in 2026",
                'desc' => 'Analysis of latest policies and investment opportunities.',
                'category' => 'Case Studies',
                'sort_order' => 1,
                'is_published' => true,
            ],
            [
                'type' => 'blog',
                'title' => 'From Coal to Solar: Just Energy Transition in SE Asia',
                'desc' => 'Challenges and success stories from the region.',
                'category' => 'Opinion',
                'sort_order' => 2,
                'is_published' => true,
            ],
            [
                'type' => 'blog',
                'title' => 'Rooftop Solar Economics in Phnom Penh',
                'desc' => 'Real payback numbers from recent installations.',
                'category' => 'Energy Transition',
                'sort_order' => 3,
                'is_published' => true,
            ],
            [
                'type' => 'publication',
                'title' => 'Solar Energy Market Report 2025 - Cambodia',
                'desc' => 'Comprehensive analysis and forecast until 2030.',
                'category' => 'Report',
                'sort_order' => 1,
                'is_published' => true,
            ],
            [
                'type' => 'publication',
                'title' => 'Engineering Guidelines for Solar Projects in Tropics',
                'desc' => 'Best practices for design and installation.',
                'category' => 'Guideline',
                'sort_order' => 2,
                'is_published' => true,
            ],
        ];
    }
}
