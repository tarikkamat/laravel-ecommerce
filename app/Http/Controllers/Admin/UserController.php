<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserStoreRequest;
use App\Http\Requests\Admin\UserUpdateRequest;
use App\Services\Contracts\IUserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(private readonly IUserService $service) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);

        return Inertia::render('admin/users/index', [
            'items' => $this->service->paginate($perPage),
            'options' => $this->options(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/users/create');
    }

    public function store(UserStoreRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()->route('admin.users.index');
    }

    public function show(int $id)
    {
        return Inertia::render('admin/users/show', [
            'item' => $this->service->findOrFail($id),
            'options' => $this->options(),
        ]);
    }

    public function update(UserUpdateRequest $request, int $id)
    {
        $payload = $request->validated();
        if (empty($payload['password'])) {
            unset($payload['password']);
        }

        $this->service->update($id, $payload);

        return redirect()->route('admin.users.index');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);

        return redirect()->route('admin.users.index');
    }

    private function options(): array
    {
        return [
            'roles' => collect(Role::cases())
                ->map(fn (Role $role): array => [
                    'value' => $role->value,
                    'label' => ucfirst($role->value),
                ])
                ->values()
                ->all(),
        ];
    }
}
