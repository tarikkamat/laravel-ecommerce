<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Contracts\IProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(private readonly IProductService $service) {}

    public function index(Request $request): Response
    {
        $perPage = (int) $request->integer('per_page', 15);

        return Inertia::render('storefront/products/index', [
            'products' => $this->service->paginate($perPage),
        ]);
    }

    public function show(string $identifier): Response
    {
        return Inertia::render('storefront/products/show', [
            'product' => $this->service->findBySlugOrIdOrFail($identifier),
        ]);
    }
}
