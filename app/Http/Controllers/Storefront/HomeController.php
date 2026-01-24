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
        return Inertia::render('storefront/home/index', [
            'apiEndpoints' => [
                'categories' => route('api.home.categories'),
                'products' => route('api.home.products'),
                'brands' => route('api.home.brands'),
            ],
        ]);
    }
}
