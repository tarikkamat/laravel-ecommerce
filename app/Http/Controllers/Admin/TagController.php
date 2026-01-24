<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TagStoreRequest;
use App\Http\Requests\Admin\TagUpdateRequest;
use App\Services\Contracts\ITagService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
{
    public function __construct(private readonly ITagService $service) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);

        return Inertia::render('admin/tags/index', [
            'items' => $this->service->paginate($perPage)
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/tags/create');
    }

    public function store(TagStoreRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()->route('admin.tags.index');
    }

    public function show(int $id)
    {
        return Inertia::render('admin/tags/show', [
            'item' => $this->service->findOrFail($id),
        ]);
    }

    public function edit(int $id)
    {
        return Inertia::render('admin/tags/edit', [
            'item' => $this->service->findOrFail($id),
        ]);
    }

    public function update(TagUpdateRequest $request, int $id)
    {
        $this->service->update($id, $request->validated());

        return redirect()->route('admin.tags.index');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);

        return redirect()->route('admin.tags.index');
    }
}
