<?php

declare(strict_types=1);

namespace App\Modules\Booking\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLandingSettingsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'enabled' => 'boolean',
            'template' => 'string|max:50',
            'section_order' => 'nullable|array',
            'section_order.*' => 'string',

            'hero.enabled' => 'boolean',
            'hero.title' => 'string|max:200',
            'hero.subtitle' => 'string|max:500',
            'hero.cta_text' => 'string|max:100',
            'hero.cta_link' => 'string|max:200',
            'hero.background_type' => 'string|in:color,image,carousel',
            'hero.background_image' => 'nullable|string|max:500',
            'hero.overlay_opacity' => 'integer|min:0|max:100',
            'hero.carousel_interval' => 'integer|min:2000|max:15000',
            'hero.carousel_items' => 'nullable|array|max:5',
            'hero.carousel_items.*.title' => 'nullable|string|max:200',
            'hero.carousel_items.*.subtitle' => 'nullable|string|max:500',
            'hero.carousel_items.*.cta_text' => 'nullable|string|max:100',
            'hero.carousel_items.*.cta_link' => 'nullable|string|max:200',
            'hero.carousel_items.*.background_image' => 'nullable|string|max:500',

            'about.enabled' => 'boolean',
            'about.title' => 'string|max:200',
            'about.content' => 'string|max:5000',
            'about.image' => 'nullable|string|max:500',

            'features.enabled' => 'boolean',
            'features.title' => 'string|max:200',
            'features.subtitle' => 'string|max:500',
            'features.items' => 'nullable|array',
            'features.items.*.icon' => 'string|max:50',
            'features.items.*.title' => 'string|max:200',
            'features.items.*.description' => 'string|max:1000',

            'stats.enabled' => 'boolean',
            'stats.items' => 'nullable|array',
            'stats.items.*.number' => 'string|max:20',
            'stats.items.*.label' => 'string|max:100',

            'services.enabled' => 'boolean',
            'services.title' => 'string|max:200',
            'services.subtitle' => 'string|max:500',

            'team.enabled' => 'boolean',
            'team.title' => 'string|max:200',
            'team.subtitle' => 'string|max:500',

            'pricing.enabled' => 'boolean',
            'pricing.title' => 'string|max:200',
            'pricing.subtitle' => 'string|max:500',
            'pricing.items' => 'nullable|array',
            'pricing.items.*.name' => 'string|max:100',
            'pricing.items.*.price' => 'string|max:50',
            'pricing.items.*.period' => 'string|max:20',
            'pricing.items.*.description' => 'string|max:500',
            'pricing.items.*.features' => 'nullable|array',
            'pricing.items.*.features.*' => 'string|max:200',
            'pricing.items.*.cta_text' => 'string|max:100',
            'pricing.items.*.cta_link' => 'string|max:200',
            'pricing.items.*.highlighted' => 'boolean',
            'pricing.items.*.highlight_label' => 'string|max:50',

            'testimonials.enabled' => 'boolean',
            'testimonials.title' => 'string|max:200',
            'testimonials.subtitle' => 'string|max:500',
            'testimonials.items' => 'nullable|array',
            'testimonials.items.*.name' => 'string|max:100',
            'testimonials.items.*.role' => 'string|max:100',
            'testimonials.items.*.content' => 'string|max:2000',
            'testimonials.items.*.rating' => 'integer|min:1|max:5',

            'faq.enabled' => 'boolean',
            'faq.title' => 'string|max:200',
            'faq.subtitle' => 'string|max:500',
            'faq.items' => 'nullable|array',
            'faq.items.*.question' => 'string|max:500',
            'faq.items.*.answer' => 'string|max:2000',

            'gallery.enabled' => 'boolean',
            'gallery.title' => 'string|max:200',
            'gallery.subtitle' => 'string|max:500',
            'gallery.items' => 'nullable|array',
            'gallery.items.*.image' => 'nullable|string|max:500',
            'gallery.items.*.title' => 'string|max:200',
            'gallery.items.*.description' => 'string|max:500',

            'cta.enabled' => 'boolean',
            'cta.title' => 'string|max:200',
            'cta.subtitle' => 'string|max:500',
            'cta.button_text' => 'string|max:100',
            'cta.button_link' => 'string|max:200',
            'cta.background_color' => 'string|max:20',
            'cta.text_color' => 'string|max:20',

            'branches.enabled' => 'boolean',
            'branches.title' => 'string|max:200',
            'branches.subtitle' => 'string|max:500',

            'contact.enabled' => 'boolean',
            'contact.title' => 'string|max:200',
            'contact.subtitle' => 'string|max:500',
            'contact.address' => 'string|max:500',
            'contact.phone' => 'string|max:30',
            'contact.email' => 'string|email|max:200',
            'contact.whatsapp_number' => 'string|max:30',
            'contact.map_embed_url' => 'nullable|string|max:1000',

            'divider.enabled' => 'boolean',
            'divider.style' => 'string|in:line,dots,wave,space',
            'divider.height' => 'integer|min:10|max:500',

            'logo_cloud.enabled' => 'boolean',
            'logo_cloud.title' => 'string|max:200',
            'logo_cloud.items' => 'nullable|array',
            'logo_cloud.items.*.image' => 'nullable|string|max:500',
            'logo_cloud.items.*.name' => 'string|max:100',
            'logo_cloud.items.*.url' => 'string|max:500',

            'colors.primary' => 'string|max:20',
            'colors.secondary' => 'string|max:20',
            'colors.accent' => 'string|max:20',
            'colors.background' => 'string|max:20',
            'colors.text' => 'string|max:20',
            'colors.text_muted' => 'string|max:20',

            'footer.copyright_text' => 'string|max:500',
        ];
    }
}
