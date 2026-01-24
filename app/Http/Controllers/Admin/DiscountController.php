<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DiscountStoreRequest;
use App\Http\Requests\Admin\DiscountUpdateRequest;
use App\Services\Contracts\IDiscountService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiscountController extends Controller
{
    public function __construct(private readonly IDiscountService $service) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);

        return Inertia::render('admin/discounts/index', [
            'items' => $this->service->paginate($perPage)
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/discounts/create');
    }

    public function store(DiscountStoreRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()->route('admin.discounts.index');
    }

    public function show(int $id)
    {
        return Inertia::render('admin/discounts/show', [
            'item' => $this->service->findOrFail($id)
        ]);
    }

    public function update(DiscountUpdateRequest $request, int $id)
    {
        $this->service->update($id, $request->validated());

        return redirect()->route('admin.discounts.index');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);

        return redirect()->route('admin.discounts.index');
    }
}
