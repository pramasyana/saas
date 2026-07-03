<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Modules\Service\Models\Category;
use App\Modules\Service\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(string $tenantId, string $branchId): void
    {
        $categories = [
            [
                'name' => 'Perawatan Wajah',
                'slug' => 'perawatan-wajah',
                'description' => 'Facial treatment untuk kulit sehat dan bercahaya',
                'color' => '#7C3AED',
                'sort_order' => 1,
            ],
            [
                'name' => 'Perawatan Tubuh',
                'slug' => 'perawatan-tubuh',
                'description' => 'Body treatment relaksasi dan peremajaan',
                'color' => '#10B981',
                'sort_order' => 2,
            ],
            [
                'name' => 'Hair Treatment',
                'slug' => 'hair-treatment',
                'description' => 'Perawatan rambut profesional',
                'color' => '#F59E0B',
                'sort_order' => 3,
            ],
            [
                'name' => 'Nail Art & Manicure',
                'slug' => 'nail-art-manicure',
                'description' => 'Perawatan kuku dan seni kuku',
                'color' => '#EC4899',
                'sort_order' => 4,
            ],
            [
                'name' => 'Massage & Spa',
                'slug' => 'massage-spa',
                'description' => 'Pijat relaksasi dan spa tradisional',
                'color' => '#3B82F6',
                'sort_order' => 5,
            ],
            [
                'name' => 'Paket Spesial',
                'slug' => 'paket-spesial',
                'description' => 'Paket hemat untuk perawatan lengkap',
                'color' => '#EF4444',
                'sort_order' => 6,
            ],
        ];

        $createdCategories = [];
        foreach ($categories as $cat) {
            $category = Category::create([
                'tenant_id' => $tenantId,
                'branch_id' => $branchId,
                'name' => $cat['name'],
                'slug' => $cat['slug'],
                'description' => $cat['description'],
                'color' => $cat['color'],
                'sort_order' => $cat['sort_order'],
                'is_active' => true,
            ]);
            $createdCategories[$cat['slug']] = $category->id;
        }

        $services = [
            // Perawatan Wajah
            [
                'category_slug' => 'perawatan-wajah',
                'name' => 'Basic Facial',
                'description' => 'Pembersihan wajah dasar, eksfoliasi, masker, dan pelembab',
                'duration' => 60,
                'price' => 150000,
                'color' => '#7C3AED',
            ],
            [
                'category_slug' => 'perawatan-wajah',
                'name' => 'Acne Treatment',
                'description' => 'Perawatan khusus kulit berjerawat dengan bahan antibakteri',
                'duration' => 75,
                'price' => 200000,
                'color' => '#DB2777',
            ],
            [
                'category_slug' => 'perawatan-wajah',
                'name' => 'Anti Aging Facial',
                'description' => 'Perawatan anti aging dengan kolagen dan vitamin E',
                'duration' => 90,
                'price' => 300000,
                'color' => '#D946EF',
            ],
            [
                'category_slug' => 'perawatan-wajah',
                'name' => 'Brightening Facial',
                'description' => 'Perawatan mencerahkan wajah dengan vitamin C',
                'duration' => 75,
                'price' => 250000,
                'color' => '#F472B6',
            ],
            [
                'category_slug' => 'perawatan-wajah',
                'name' => 'Microdermabrasion',
                'description' => 'Eksfoliasi intensif untuk kulit lebih halus dan cerah',
                'duration' => 60,
                'price' => 350000,
                'color' => '#A855F7',
            ],
            // Perawatan Tubuh
            [
                'category_slug' => 'perawatan-tubuh',
                'name' => 'Body Scrub & Mask',
                'description' => 'Lulur dan masker tubuh untuk kulit halus',
                'duration' => 90,
                'price' => 200000,
                'color' => '#10B981',
            ],
            [
                'category_slug' => 'perawatan-tubuh',
                'name' => 'Body Wrap',
                'description' => 'Balutan tubuh untuk detoksifikasi dan mengencangkan kulit',
                'duration' => 75,
                'price' => 250000,
                'color' => '#059669',
            ],
            [
                'category_slug' => 'perawatan-tubuh',
                'name' => 'Traditional Scrub',
                'description' => 'Lulur tradisional dengan rempah-rempah pilihan',
                'duration' => 120,
                'price' => 280000,
                'color' => '#34D399',
            ],
            // Hair Treatment
            [
                'category_slug' => 'hair-treatment',
                'name' => 'Hair Cut & Styling',
                'description' => 'Potong rambut dan styling sesuai keinginan',
                'duration' => 45,
                'price' => 100000,
                'color' => '#F59E0B',
            ],
            [
                'category_slug' => 'hair-treatment',
                'name' => 'Hair Coloring',
                'description' => 'Pewarnaan rambut profesional',
                'duration' => 120,
                'price' => 350000,
                'color' => '#D97706',
            ],
            [
                'category_slug' => 'hair-treatment',
                'name' => 'Hair Smoothing',
                'description' => 'Pelurusan rambut dengan keratin',
                'duration' => 180,
                'price' => 500000,
                'color' => '#FBBF24',
            ],
            [
                'category_slug' => 'hair-treatment',
                'name' => 'Hair Treatment Keratin',
                'description' => 'Perawatan keratin untuk rambut rusak',
                'duration' => 60,
                'price' => 200000,
                'color' => '#FDE68A',
            ],
            // Nail Art & Manicure
            [
                'category_slug' => 'nail-art-manicure',
                'name' => 'Basic Manicure',
                'description' => 'Merapikan kuku dan kutikula dasar',
                'duration' => 30,
                'price' => 75000,
                'color' => '#EC4899',
            ],
            [
                'category_slug' => 'nail-art-manicure',
                'name' => 'Gel Nail Art',
                'description' => 'Seni kuku gel dengan desain custom',
                'duration' => 90,
                'price' => 200000,
                'color' => '#F472B6',
            ],
            [
                'category_slug' => 'nail-art-manicure',
                'name' => 'Pedicure Spa',
                'description' => 'Perawatan kaki lengkap dengan spa',
                'duration' => 60,
                'price' => 150000,
                'color' => '#BE185D',
            ],
            [
                'category_slug' => 'nail-art-manicure',
                'name' => 'Nail Extension',
                'description' => 'Sambung kuku dengan gel atau akrilik',
                'duration' => 120,
                'price' => 300000,
                'color' => '#FB7185',
            ],
            // Massage & Spa
            [
                'category_slug' => 'massage-spa',
                'name' => 'Swedish Massage',
                'description' => 'Pijat relaksasi seluruh tubuh dengan minyak aromaterapi',
                'duration' => 60,
                'price' => 200000,
                'color' => '#3B82F6',
            ],
            [
                'category_slug' => 'massage-spa',
                'name' => 'Deep Tissue Massage',
                'description' => 'Pijat jaringan dalam untuk melepas ketegangan otot',
                'duration' => 90,
                'price' => 300000,
                'color' => '#2563EB',
            ],
            [
                'category_slug' => 'massage-spa',
                'name' => 'Hot Stone Massage',
                'description' => 'Pijat dengan batu hangat untuk relaksasi maksimal',
                'duration' => 90,
                'price' => 350000,
                'color' => '#60A5FA',
            ],
            [
                'category_slug' => 'massage-spa',
                'name' => 'Aromatherapy Massage',
                'description' => 'Pijat dengan minyak esensial pilihan',
                'duration' => 75,
                'price' => 250000,
                'color' => '#93C5FD',
            ],
            [
                'category_slug' => 'massage-spa',
                'name' => 'Traditional Massage',
                'description' => 'Pijat tradisional khas Indonesia',
                'duration' => 120,
                'price' => 280000,
                'color' => '#1D4ED8',
            ],
            // Paket Spesial
            [
                'category_slug' => 'paket-spesial',
                'name' => 'Paket Relax',
                'description' => 'Body scrub 90 menit + Swedish massage 60 menit',
                'duration' => 150,
                'price' => 400000,
                'color' => '#EF4444',
            ],
            [
                'category_slug' => 'paket-spesial',
                'name' => 'Paket Glowing',
                'description' => 'Brightening facial 75 menit + Body scrub 90 menit',
                'duration' => 165,
                'price' => 400000,
                'color' => '#F87171',
            ],
            [
                'category_slug' => 'paket-spesial',
                'name' => 'Paket Lengkap',
                'description' => 'Facial 60 menit + Body scrub 90 menit + Massage 60 menit',
                'duration' => 210,
                'price' => 550000,
                'color' => '#DC2626',
            ],
        ];

        foreach ($services as $svc) {
            Service::create([
                'tenant_id' => $tenantId,
                'branch_id' => $branchId,
                'category_id' => $createdCategories[$svc['category_slug']],
                'name' => $svc['name'],
                'description' => $svc['description'],
                'duration' => $svc['duration'],
                'price' => $svc['price'],
                'color' => $svc['color'],
                'is_active' => true,
            ]);
        }
    }
}
