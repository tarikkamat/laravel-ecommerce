<?php

namespace App\Http\Middleware;

use App\Services\Contracts\IBrandService;
use App\Services\Contracts\ICategoryService;
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
        private readonly IBrandService $brandService
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
}
