<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ImageStoreRequest;
use App\Http\Requests\Admin\ImageUpdateRequest;
use App\Services\Contracts\IImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ImageController extends Controller
{
    public function __construct(private readonly IImageService $service) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);

        return Inertia::render('admin/images/index', [
            'items' => $this->service->paginate($perPage),
            'options' => new \stdClass,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/images/create');
    }

    public function store(ImageStoreRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()->route('admin.images.index');
    }

    public function show(int $id)
    {
        return Inertia::render('admin/images/show', [
            'item' => $this->service->findOrFail($id),
            'options' => new \stdClass,
        ]);
    }

    public function update(ImageUpdateRequest $request, int $id)
    {
        $this->service->update($id, $request->validated());

        return redirect()->route('admin.images.index');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);

        return redirect()->route('admin.images.index');
    }
}
