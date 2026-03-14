<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserStoreRequest;
use App\Http\Requests\Admin\UserUpdateRequest;
use App\Models\Address;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\ProductComment;
use App\Models\User;
use App\Services\Contracts\IUserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(private readonly IUserService $service) {}

    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 15);
        $items = $this->service->paginate($perPage, ['*'], ['addresses', 'orders.addresses']);

        $items->setCollection(
            $items->getCollection()->map(function (User $user): array {
                $latestOrderAddress = $user->orders
                    ->sortByDesc('id')
                    ->flatMap(fn (Order $order) => $order->addresses)
                    ->sortByDesc('id')
                    ->first();

                $primaryAddress = $user->addresses
                    ->sortByDesc('id')
                    ->first();

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at?->toIso8601String(),
                    'role' => $user->role instanceof Role ? $user->role->value : $user->role,
                    'phone' => $this->resolvePhone($latestOrderAddress),
                    'address_summary' => $this->resolveAddressSummary($primaryAddress, $latestOrderAddress),
                    'addresses' => $user->addresses->values()->all(),
                    'two_factor_confirmed_at' => $user->two_factor_confirmed_at?->toIso8601String(),
                    'created_at' => $user->created_at?->toIso8601String(),
                    'updated_at' => $user->updated_at?->toIso8601String(),
                ];
            })
        );

        return Inertia::render('admin/users/index', [
            'items' => $items,
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
            ->with(['payments', 'shipments'])
            ->withSum('items as items_count', 'qty')
            ->where('user_id', $user->id)
            ->latest('id')
            ->paginate(8, ['*'], 'orders_page')
            ->withQueryString();

        $orders->setCollection(
            $orders->getCollection()->map(function (Order $order): array {
                $payment = $order->payments->sortByDesc('id')->first();
                $shipment = $order->shipments->first();

                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'currency' => $order->currency,
                    'grandTotal' => (float) $order->grand_total,
                    'itemsCount' => (int) ($order->items_count ?? 0),
                    'createdAt' => $order->created_at?->toIso8601String(),
                    'paymentStatus' => $payment?->status,
                    'shipmentStatus' => $shipment?->shipment_status,
                ];
            })
        );

        $comments = ProductComment::query()
            ->with('product:id,title')
            ->where('user_id', $user->id)
            ->latest('id')
            ->paginate(8, ['*'], 'comments_page')
            ->withQueryString();

        $comments->setCollection(
            $comments->getCollection()->map(function (ProductComment $comment) use ($user): array {
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
        );

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
            ...$this->options(),
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

    private function resolvePhone(?OrderAddress $latestOrderAddress): ?string
    {
        $phone = $latestOrderAddress?->phone;

        return filled($phone) ? $phone : null;
    }

    private function resolveAddressSummary(?Address $primaryAddress, ?OrderAddress $latestOrderAddress): ?string
    {
        if ($primaryAddress) {
            return collect([
                $primaryAddress->address,
                $primaryAddress->city,
                $primaryAddress->country,
            ])->filter(fn (?string $value) => filled($value))->implode(', ');
        }

        if ($latestOrderAddress) {
            return collect([
                $latestOrderAddress->line1,
                $latestOrderAddress->district,
                $latestOrderAddress->city,
                $latestOrderAddress->country,
            ])->filter(fn (?string $value) => filled($value))->implode(', ');
        }

        return null;
    }
}
