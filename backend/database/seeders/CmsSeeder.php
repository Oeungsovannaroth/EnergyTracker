<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Blog;
use App\Models\Bookmark;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Country;
use App\Models\Feature;
use App\Models\Media;
use App\Models\Page;
use App\Models\Publication;
use App\Models\Region;
use App\Models\Spotlight;
use App\Models\User;
use Illuminate\Database\Seeder;

class CmsSeeder extends Seeder
{
    public function run(): void
    {
        Page::query()->delete();
        Bookmark::query()->delete();
        Comment::query()->delete();
        Feature::query()->delete();
        Article::query()->delete();
        Blog::query()->delete();
        Media::query()->delete();
        Publication::query()->delete();
        Spotlight::query()->delete();
        Category::query()->delete();
        Country::query()->delete();
        Region::query()->delete();

        $admin = User::query()->where('role', 'admin')->first();
        $user = User::query()->where('role', 'user')->first();
        $adminId = $admin ? (string) $admin->getKey() : null;
        $userId = $user ? (string) $user->getKey() : null;

        $sea = Region::create([
            'name' => 'Southeast Asia',
            'description' => 'Solar markets across ASEAN including Cambodia, Singapore, and emerging hubs.',
        ]);

        $east = Region::create([
            'name' => 'East Asia',
            'description' => 'Advanced solar engineering and manufacturing ecosystems.',
        ]);

        $cambodia = Country::create([
            'region_id' => (string) $sea->getKey(),
            'name' => 'Cambodia',
            'slug' => 'cambodia',
            'flag' => '🇰🇭',
            'description' => 'Rapid rooftop adoption and utility-scale pipeline growth.',
        ]);

        $india = Country::create([
            'region_id' => (string) $sea->getKey(),
            'name' => 'India',
            'slug' => 'india',
            'flag' => '🇮🇳',
            'description' => 'One of the largest solar deployment markets globally.',
        ]);

        $singapore = Country::create([
            'region_id' => (string) $sea->getKey(),
            'name' => 'Singapore',
            'slug' => 'singapore',
            'flag' => '🇸🇬',
            'description' => 'Green Plan and floating solar leadership.',
        ]);

        $japan = Country::create([
            'region_id' => (string) $east->getKey(),
            'name' => 'Japan',
            'slug' => 'japan',
            'flag' => '🇯🇵',
            'description' => 'High-efficiency modules and grid modernization leadership.',
        ]);

        Country::create([
            'region_id' => (string) $east->getKey(),
            'name' => 'South Korea',
            'slug' => 'south-korea',
            'flag' => '🇰🇷',
            'description' => 'Advanced manufacturing and battery-integrated solar.',
        ]);

        Spotlight::create([
            'country_id' => (string) $cambodia->getKey(),
            'title' => 'Cambodia Solar Roadmap 2026-2030',
            'content' => 'Updated national targets, incentive programs, and priority provinces for utility-scale and rooftop development.',
            'thumbnail' => 'https://www.undp.org/sites/g/files/zskgke326/files/styles/scaled_image_large/public/migration/kh/UNDP_KH_Promoting-The-Use-Of-Solar-Technologies-.jpg',
            'status' => true,
        ]);

        $blogCategory = Category::create([
            'name' => 'Case Studies',
            'slug' => 'case-studies',
            'type' => 'blog',
        ]);

        Category::create([
            'name' => 'Energy Transition Inspiration',
            'slug' => 'transition',
            'type' => 'blog',
        ]);

        Category::create([
            'name' => 'Opinion Pieces',
            'slug' => 'opinion',
            'type' => 'blog',
        ]);

        $articleCategory = Category::create([
            'name' => 'Policy',
            'slug' => 'policy',
            'type' => 'article',
        ]);

        $article = Article::create([
            'category_id' => (string) $articleCategory->getKey(),
            'country_id' => (string) $cambodia->getKey(),
            'author_id' => $adminId,
            'title' => 'Cambodia Solar Market Outlook 2026',
            'slug' => 'cambodia-solar-market-outlook-2026',
            'summary' => 'Investment trends, policy updates, and project pipeline analysis.',
            'content' => 'Cambodia continues to expand distributed solar with strong rooftop adoption in Phnom Penh and provincial commercial centers.',
            'thumbnail' => 'https://www.khmertimeskh.com/wp-content/uploads/2026/03/Metfone-1-Main.jpg',
            'status' => 'published',
            'views' => 128,
        ]);

        Feature::create([
            'article_id' => (string) $article->getKey(),
            'title' => '2.8 GW target by 2030',
            'description' => 'National installed capacity ambition for renewable generation.',
            'image' => 'https://www.cenergi-sea.com/wp-content/uploads/2021/05/irms_01.jpg',
        ]);

        $blog = Blog::create([
            'category_id' => (string) $blogCategory->getKey(),
            'author_id' => $adminId,
            'title' => 'Rooftop Solar Economics in Phnom Penh',
            'slug' => 'rooftop-solar-economics-phnom-penh',
            'content' => 'Real payback numbers from recent installations across commercial and residential rooftops.',
            'thumbnail' => 'https://www.apolloenergy.nz/assets/blog/how-much-power-does-a-5kw-solar-system-produce-hero.jpg',
            'status' => 'published',
            'views' => 84,
        ]);

        if ($userId) {
            Comment::create([
                'blog_id' => (string) $blog->getKey(),
                'user_id' => $userId,
                'comment' => 'Great breakdown of payback periods for SMEs.',
            ]);

            Bookmark::create([
                'user_id' => $userId,
                'article_id' => (string) $article->getKey(),
            ]);
        }

        Media::create([
            'author_id' => $adminId,
            'type' => 'video',
            'title' => 'Designing Solar for Tropical Climates',
            'description' => 'Engineering considerations for heat, humidity, and monsoon seasons.',
            'thumbnail' => 'https://www.apolloenergy.nz/assets/blog/how-much-power-does-a-5kw-solar-system-produce-hero.jpg',
            'media_url' => 'https://example.com/videos/tropical-solar-design.mp4',
            'duration' => '12:40',
        ]);

        Publication::create([
            'author_id' => $adminId,
            'title' => 'Solar Energy Market Report 2025 - Cambodia',
            'description' => 'Comprehensive analysis and forecast until 2030.',
            'publication_type' => 'report',
            'image' => 'https://www.apolloenergy.nz/assets/blog/how-much-power-does-a-5kw-solar-system-produce-hero.jpg',
            'file_url' => 'https://example.com/reports/cambodia-solar-2025.pdf',
            'download_count' => 42,
        ]);

        $this->seedPages();
    }

    private function seedPages(): void
    {
        $navCategories = [];

        foreach ([
            ['name' => 'Features', 'slug' => 'features', 'path' => '/features', 'sort_order' => 1],
            ['name' => 'Spotlight', 'slug' => 'spotlight', 'path' => '/spotlight', 'sort_order' => 2],
            ['name' => 'Publications', 'slug' => 'publications', 'path' => '/publications', 'sort_order' => 8],
        ] as $item) {
            Category::create([
                ...$item,
                'type' => 'nav',
                'is_published' => true,
            ]);
        }

        foreach ([
            'fossil-fuel' => ['name' => 'Fossil Fuel', 'path' => '/fossil-fuel', 'children' => ['Coal', 'Oil and Gas', 'Petroleum', 'Natural Gas']],
            'regions' => ['name' => 'Regions', 'path' => '/regions', 'children' => ['Cambodia', 'India', 'Singapore', 'Japan', 'South Korea', 'Other Regions']],
            'renewable-energy' => ['name' => 'Renewable Energy', 'path' => '/renewable-energy', 'children' => ['Solar', 'Wind', 'Clean Energy Financing', 'Fair & Just Transition']],
            'media' => ['name' => 'Media', 'path' => '/media', 'children' => ['Videos', 'Podcasts']],
            'blog' => ['name' => 'Blog', 'path' => '/blog', 'children' => ['Case Studies', 'Energy Transition Inspiration', 'Opinion Pieces']],
        ] as $index => $group) {
            $parent = Category::create([
                'name' => $group['name'],
                'slug' => $index,
                'type' => 'nav',
                'path' => $group['path'],
                'sort_order' => count($navCategories) + 3,
                'is_published' => true,
            ]);

            foreach ($group['children'] as $childIndex => $childName) {
                $slug = str($childName)->slug()->toString();
                $navCategories[$slug] = Category::create([
                    'parent_id' => (string) $parent->getKey(),
                    'name' => $childName,
                    'slug' => $slug,
                    'type' => 'nav',
                    'path' => '/category/'.$slug,
                    'sort_order' => $childIndex + 1,
                    'is_published' => true,
                ]);
            }
        }

        $sections = [
            ['/features', [
                ['slug' => 'solar-design', 'title' => 'Advanced Solar System Design', 'description' => 'Tailored engineering solutions for residential, commercial, and utility-scale projects.', 'category' => 'Engineering'],
                ['slug' => 'installation', 'title' => 'Climate-Resilient Installation', 'description' => 'Installation techniques for humidity, monsoon rains, and extreme heat.', 'category' => 'Installation'],
                ['slug' => 'monitoring', 'title' => 'Smart Performance Monitoring', 'description' => 'Real-time IoT dashboards and predictive maintenance alerts.', 'category' => 'Technology'],
            ]],
            ['/fossil-fuel', [
                ['slug' => 'coal', 'path' => '/fossil-fuel/coal', 'title' => 'Coal', 'description' => 'Coal market trends and transition pathways in Southeast Asia.'],
                ['slug' => 'oil-gas', 'path' => '/fossil-fuel/oil-gas', 'title' => 'Oil and Gas', 'description' => 'Regional supply, pricing, and decarbonization pressure.'],
            ]],
            ['/renewable-energy', [
                ['slug' => 'solar', 'path' => '/renewable-energy/solar', 'title' => 'Solar', 'description' => 'Utility-scale and rooftop solar engineering resources.'],
                ['slug' => 'wind', 'path' => '/renewable-energy/wind', 'title' => 'Wind', 'description' => 'Wind resource assessment and project development.'],
            ]],
            ['/blog/case-studies', [
                ['slug' => 'cambodia-rooftop', 'title' => 'Cambodia Rooftop Success Story', 'description' => 'Commercial installation payback analysis in Phnom Penh.'],
            ]],
        ];

        foreach ($sections as [$parentPath, $pages]) {
            foreach ($pages as $index => $page) {
                Page::create([
                    'parent_path' => $parentPath,
                    'path' => $page['path'] ?? $parentPath.'/'.$page['slug'],
                    'slug' => $page['slug'],
                    'title' => $page['title'],
                    'description' => $page['description'],
                    'content' => $page['description'].' Detailed content managed from admin dashboard.',
                    'category' => $page['category'] ?? null,
                    'category_id' => isset($navCategories[$page['slug']]) ? (string) $navCategories[$page['slug']]->getKey() : null,
                    'sort_order' => $index + 1,
                    'is_published' => true,
                ]);
            }
        }
    }
}
