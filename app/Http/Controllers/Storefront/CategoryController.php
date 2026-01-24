<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Contracts\ICategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(private readonly ICategoryService $service) {}

    public function index(Request $request): Response
    {
        $perPage = (int) $request->integer('per_page', 15);

        return Inertia::render('storefront/categories/index', [
            'categories' => $this->service->paginate($perPage),
        ]);
    }

    public function show(string $identifier): Response
    {
        return Inertia::render('storefront/categories/show', [
            'category' => $this->service->findBySlugOrIdOrFail($identifier),
        ]);
    }
}
