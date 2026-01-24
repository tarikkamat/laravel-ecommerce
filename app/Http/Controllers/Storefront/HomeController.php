<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Contracts\ICategoryService;
use App\Services\Contracts\IProductService;
use App\Services\Contracts\IBrandService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private readonly ICategoryService $categoryService,
        private readonly IProductService $productService,
        private readonly IBrandService $brandService
    ) {}

    public function index(): Response
    {
        // Get featured categories (first 4)
        $categories = $this->categoryService->paginate(4);

        // Get featured products (first 3)
        $featuredProducts = $this->productService->paginate(3);

        // Get all brands
        $brands = $this->brandService->all();

        return Inertia::render('storefront/home/index', [
            'categories' => $categories,
            'featuredProducts' => $featuredProducts,
            'brands' => $brands,
        ]);
    }
}
