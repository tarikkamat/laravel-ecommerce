<?php

namespace App\Http\Middleware;

use App\Services\Contracts\IBrandService;
use App\Services\Contracts\ICategoryService;
use App\Services\CartResolver;
use App\Services\CartTotalsService;
use App\Services\ShippingService;
use App\Settings\HomeSettings;
use App\Settings\NavigationSettings;
use App\Settings\SiteSettings;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    public function __construct(
        private readonly ICategoryService $categoryService,
        private readonly IBrandService $brandService,
        private readonly CartResolver $cartResolver,
        private readonly CartTotalsService $cartTotalsService,
        private readonly ShippingService $shippingService
    ) {}

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'navCategories' => fn () => $this->getNavCategories(),
            'navBrands' => fn () => $this->getNavBrands(),
            'cartSummary' => fn () => $this->getCartSummary($request),
            'storefrontSettings' => fn () => $this->getStorefrontSettings(),
            'flash' => [
                'paymentStatus' => fn () => $request->session()->get('paymentStatus'),
                'orderId' => fn () => $request->session()->get('orderId'),
            ],
        ];
    }

    /**
     * Get categories for navigation mega menu.
     */
    private function getNavCategories(): array
    {
        return $this->categoryService->getCategoriesForMegaMenu()
            ->map(fn ($category) => [
                'id' => $category->id,
                'title' => $category->title,
                'slug' => $category->slug,
                'image' => $category->image?->path ? '/storage/' . $category->image->path : null,
                'children' => $category->children->map(fn ($child) => [
                    'id' => $child->id,
                    'title' => $child->title,
                    'slug' => $child->slug,
                    'children' => $child->children->map(fn ($grandChild) => [
                        'id' => $grandChild->id,
                        'title' => $grandChild->title,
                        'slug' => $grandChild->slug,
                    ])->values()->toArray(),
                ])->values()->toArray(),
            ])
            ->values()
            ->toArray();
    }

    /**
     * Get brands for navigation mega menu.
     */
    private function getNavBrands(): array
    {
        return $this->brandService->getBrandsForMegaMenu()
            ->map(fn ($brand) => [
                'id' => $brand->id,
                'title' => $brand->title,
                'slug' => $brand->slug,
                'image' => $brand->image?->path ? '/storage/' . $brand->image->path : null,
            ])
            ->values()
            ->toArray();
    }

    /**
     * Share a lightweight cart summary without creating a cart row on every request.
     *
     * @return array<string, mixed>
     */
    private function getCartSummary(Request $request): array
    {
        $cart = $this->cartResolver->peek($request, withItems: true);

        if (! $cart) {
            return [
                'itemsCount' => 0,
                'totals' => [
                    'currency' => 'TRY',
                    'subtotal' => 0.0,
                    'discount_total' => 0.0,
                    'tax_total' => 0.0,
                    'shipping_total' => 0.0,
                    'grand_total' => 0.0,
                    'items' => [],
                    'tax_lines' => [],
                ],
            ];
        }

        $shippingTotal = $this->shippingService->selectedShippingTotal($request, $cart);
        $totals = $this->cartTotalsService->totals($cart, $shippingTotal);

        return [
            'itemsCount' => (int) $cart->items->sum('qty'),
            'totals' => $totals,
        ];
    }

    private function getStorefrontSettings(): array
    {
        /** @var SiteSettings $siteSettings */
        $siteSettings = app(SiteSettings::class);
        /** @var NavigationSettings $navigationSettings */
        $navigationSettings = app(NavigationSettings::class);
        /** @var HomeSettings $homeSettings */
        $homeSettings = app(HomeSettings::class);

        return [
            'site' => [
                'title' => $siteSettings->site_title,
                'meta_description' => $siteSettings->meta_description,
                'meta_keywords' => $siteSettings->meta_keywords,
                'header_logo_path' => $siteSettings->header_logo_path,
                'header_logo_text' => $siteSettings->header_logo_text,
                'header_logo_tagline' => $siteSettings->header_logo_tagline,
                'footer_logo_path' => $siteSettings->footer_logo_path,
                'footer_logo_text' => $siteSettings->footer_logo_text,
                'footer_description' => $siteSettings->footer_description,
                'footer_copyright' => $siteSettings->footer_copyright,
                'seller_name' => $siteSettings->seller_name,
                'seller_address' => $siteSettings->seller_address,
                'seller_phone' => $siteSettings->seller_phone,
                'seller_email' => $siteSettings->seller_email,
                'whatsapp_enabled' => $siteSettings->whatsapp_enabled,
                'whatsapp_phone' => $siteSettings->whatsapp_phone,
                'whatsapp_message' => $siteSettings->whatsapp_message,
                'announcement_enabled' => $siteSettings->announcement_enabled,
                'announcement_text' => $siteSettings->announcement_text,
                'announcement_speed_seconds' => $siteSettings->announcement_speed_seconds,
                'announcement_background' => $siteSettings->announcement_background,
                'announcement_text_color' => $siteSettings->announcement_text_color,
                'footer_bottom_links' => $siteSettings->footer_bottom_links,
                'footer_socials' => $siteSettings->footer_socials,
                'footer_menus' => $siteSettings->footer_menus,
            ],
            'navigation' => [
                'header_menu' => $navigationSettings->header_menu,
                'show_home_link' => $navigationSettings->show_home_link,
                'show_brands_menu' => $navigationSettings->show_brands_menu,
                'show_categories_menu' => $navigationSettings->show_categories_menu,
            ],
            'home' => [
                'hero_autoplay_ms' => $homeSettings->hero_autoplay_ms,
                'hero_slides' => $homeSettings->hero_slides,
            ],
        ];
    }
}
