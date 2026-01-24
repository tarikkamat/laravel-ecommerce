<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Contracts\IImageService;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function __construct(private readonly IImageService $service) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);

        return response()->json($this->service->paginate($perPage));
    }

    public function show(int $id)
    {
        return response()->json($this->service->findOrFail($id));
    }
}
