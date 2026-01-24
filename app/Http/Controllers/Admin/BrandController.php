<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BrandStoreRequest;
use App\Http\Requests\Admin\BrandUpdateRequest;
use App\Services\Contracts\IBrandService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use stdClass;

class BrandController extends Controller
{
    public function __construct(private readonly IBrandService $service) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);

        return Inertia::render('admin/brands/index', [
            'items' => $this->service->paginate($perPage),
        ]);
    }

    public function store(BrandStoreRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()->route('admin.brands.index');
    }

    public function create()
    {
        return Inertia::render('admin/brands/create');
    }

    public function show(int $id)
    {
        return Inertia::render('admin/brands/show', [
            'item' => $this->service->findOrFail($id),
            'options' => new stdClass,
        ]);
    }

    public function edit(int $id)
    {
        return Inertia::render('admin/brands/edit', [
            'item' => $this->service->findOrFail($id),
            'options' => new stdClass,
        ]);
    }

    public function update(BrandUpdateRequest $request, int $id)
    {
        $this->service->update($id, $request->validated());

        return redirect()->route('admin.brands.index');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);

        return redirect()->route('admin.brands.index');
    }
}
