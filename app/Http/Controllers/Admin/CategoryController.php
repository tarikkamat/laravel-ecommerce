<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryStoreRequest;
use App\Http\Requests\Admin\CategoryUpdateRequest;
use App\Models\Category;
use App\Services\Contracts\ICategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct(private readonly ICategoryService $service) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);

        return Inertia::render('admin/categories/index', [
            'items' => $this->service->paginate($perPage),
            'options' => $this->options(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/categories/create');
    }

    public function store(CategoryStoreRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()->route('admin.categories.index');
    }

    public function show(int $id)
    {
        return Inertia::render('admin/categories/show', [
            'item' => $this->service->findOrFail($id),
            'options' => $this->options(),
        ]);
    }

    public function update(CategoryUpdateRequest $request, int $id)
    {
        $this->service->update($id, $request->validated());

        return redirect()->route('admin.categories.index');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);

        return redirect()->route('admin.categories.index');
    }
}
