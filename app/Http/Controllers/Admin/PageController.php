<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PageType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PageStoreRequest;
use App\Http\Requests\Admin\PageUpdateRequest;
use App\Services\Contracts\IPageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function __construct(private readonly IPageService $service) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);

        return Inertia::render('admin/pages/index', [
            'items' => $this->service->paginate($perPage),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/pages/create', [
            'pageTypes' => $this->pageTypes(),
        ]);
    }

    public function store(PageStoreRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()->route('admin.pages.index');
    }

    public function show(int $id)
    {
        return Inertia::render('admin/pages/show', [
            'item' => $this->service->findOrFail($id),
        ]);
    }

    public function edit(int $id)
    {
        return Inertia::render('admin/pages/edit', [
            'item' => $this->service->findOrFail($id),
            'pageTypes' => $this->pageTypes(),
        ]);
    }

    public function update(PageUpdateRequest $request, int $id)
    {
        $this->service->update($id, $request->validated());

        return redirect()->route('admin.pages.index');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);

        return redirect()->route('admin.pages.index');
    }

    private function pageTypes(): array
    {
        return collect(PageType::cases())
            ->map(fn (PageType $type) => [
                'value' => $type->value,
                'label' => $type->label(),
            ])
            ->values()
            ->all();
    }
}
