<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\Contracts\ICategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(private readonly ICategoryService $service) {}

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
