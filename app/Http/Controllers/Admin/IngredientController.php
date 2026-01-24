<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\IngredientStoreRequest;
use App\Http\Requests\Admin\IngredientUpdateRequest;
use App\Services\Contracts\IIngredientService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IngredientController extends Controller
{
    public function __construct(private readonly IIngredientService $service) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);

        return Inertia::render('admin/ingredients/index', [
            'items' => $this->service->paginate($perPage),
            'options' => new \stdClass,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/ingredients/create');
    }

    public function store(IngredientStoreRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()->route('admin.ingredients.index');
    }

    public function show(int $id)
    {
        return Inertia::render('admin/ingredients/show', [
            'item' => $this->service->findOrFail($id),
            'options' => new \stdClass,
        ]);
    }

    public function update(IngredientUpdateRequest $request, int $id)
    {
        $this->service->update($id, $request->validated());

        return redirect()->route('admin.ingredients.index');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);

        return redirect()->route('admin.ingredients.index');
    }
}
