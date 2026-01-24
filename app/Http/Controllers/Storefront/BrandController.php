<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Contracts\IBrandService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function __construct(private readonly IBrandService $service) {}

    public function index(Request $request): Response
    {
        $perPage = (int) $request->integer('per_page', 15);

        return Inertia::render('storefront/brands/index', [
            'brands' => $this->service->paginate($perPage),
        ]);
    }

    public function show(string $identifier): Response
    {
        return Inertia::render('storefront/brands/show', [
            'brand' => $this->service->findBySlugOrIdOrFail($identifier),
        ]);
    }
}
