<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserStoreRequest;
use App\Http\Requests\Admin\UserUpdateRequest;
use App\Models\Order;
use App\Models\ProductComment;
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
            'items' => $this->service->paginate($perPage)
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/users/create', $this->options());
    }

    public function store(UserStoreRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()->route('admin.users.index');
    }

    public function show(int $id)
    {
        $user = $this->service->findOrFail($id, ['*'], ['addresses']);

        $orders = Order::query()
            ->with(['items', 'payments', 'shipments'])
            ->where('user_id', $user->id)
            ->latest('id')
            ->get()
            ->map(function (Order $order): array {
                $payment = $order->payments->sortByDesc('id')->first();
                $shipment = $order->shipments->first();

                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'currency' => $order->currency,
                    'grandTotal' => (float) $order->grand_total,
                    'itemsCount' => (int) $order->items->sum('qty'),
                    'createdAt' => $order->created_at?->toIso8601String(),
                    'paymentStatus' => $payment?->status,
                    'shipmentStatus' => $shipment?->shipment_status,
                ];
            })
            ->values()
            ->all();

        $comments = ProductComment::query()
            ->with('product:id,title')
            ->where('user_id', $user->id)
            ->latest('id')
            ->get()
            ->map(function (ProductComment $comment) use ($user): array {
                return [
                    'id' => $comment->id,
                    'product_id' => $comment->product_id,
                    'parent_id' => $comment->parent_id,
                    'body' => $comment->body,
                    'status' => $comment->status,
                    'approved_at' => $comment->approved_at?->toIso8601String(),
                    'created_at' => $comment->created_at->toIso8601String(),
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ],
                    'product' => $comment->product
                        ? [
                            'id' => $comment->product->id,
                            'title' => $comment->product->title,
                        ]
                        : null,
                ];
            })
            ->values()
            ->all();

        return Inertia::render('admin/users/show', [
            'item' => $user,
            'orders' => $orders,
            'comments' => $comments,
        ]);
    }

    public function edit(int $id)
    {
        return Inertia::render('admin/users/edit', [
            'item' => $this->service->findOrFail($id),
            ...$this->options()
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
                    'label' => $role->label(),
                ])
                ->values()
                ->all(),
        ];
    }
}
