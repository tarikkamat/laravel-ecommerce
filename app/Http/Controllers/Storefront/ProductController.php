<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Contracts\IProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(private readonly IProductService $service) {}

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
