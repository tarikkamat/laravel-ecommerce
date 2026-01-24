<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AddressType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AddressStoreRequest;
use App\Http\Requests\Admin\AddressUpdateRequest;
use App\Models\User;
use App\Services\Contracts\IAddressService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AddressController extends Controller
{
    public function __construct(private readonly IAddressService $service) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);

        return Inertia::render('admin/addresses/index', [
            'items' => $this->service->paginate($perPage),
            'options' => $this->options(),
        ]);
    }

    public function store(AddressStoreRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()->route('admin.addresses.index');
    }

    public function show(int $id)
    {
        return Inertia::render('admin/addresses/show', [
            'item' => $this->service->findOrFail($id),
            'options' => $this->options(),
        ]);
    }

    public function update(AddressUpdateRequest $request, int $id)
    {
        $this->service->update($id, $request->validated());

        return redirect()->route('admin.addresses.index');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);

        return redirect()->route('admin.addresses.index');
    }

    private function options(): array
    {
        return [
            'users' => User::query()
                ->select(['id', 'name', 'email'])
                ->orderBy('name')
                ->get()
                ->map(fn (User $user): array => [
                    'value' => $user->id,
                    'label' => trim($user->name.' '.$user->email),
                ])
                ->values()
                ->all(),
            'types' => collect(AddressType::cases())
                ->map(fn (AddressType $type): array => [
                    'value' => $type->value,
                    'label' => $type->label(),
                ])
                ->values()
                ->all(),
        ];
    }
}
