<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Contracts\IImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ImageController extends Controller
{
    public function __construct(private readonly IImageService $service) {}

    public function index(Request $request): Response
    {
        $perPage = (int) $request->integer('per_page', 15);

        return Inertia::render('storefront/images/index', [
            'images' => $this->service->paginate($perPage),
        ]);
    }

    public function show(string $identifier): Response
    {
        return Inertia::render('storefront/images/show', [
            'image' => $this->service->findBySlugOrIdOrFail($identifier),
        ]);
    }
}
