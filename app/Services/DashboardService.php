<?php

namespace App\Services;

use App\Enums\Role;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Services\Contracts\IDashboardService;
use Illuminate\Support\Facades\DB;

class DashboardService implements IDashboardService
{
    private const EXCLUDED_STATUSES = ['cancelled', 'refunded', 'failed'];

    /**
     * @return array<string, mixed>
     */
    public function summary(): array
    {
        $totalOrders = Order::query()
            ->whereNotIn('status', self::EXCLUDED_STATUSES)
            ->count();

        $paidOrders = Order::query()
            ->where('status', 'paid')
            ->count();

        $totalRevenue = (float) Order::query()
            ->where('status', 'paid')
            ->sum('grand_total');

        $monthStart = now()->startOfMonth();
        $monthEnd = now()->endOfMonth();

        $monthRevenue = (float) Order::query()
            ->where('status', 'paid')
            ->whereBetween('created_at', [$monthStart, $monthEnd])
            ->sum('grand_total');

        $avgOrderValue = $paidOrders > 0
            ? round($totalRevenue / $paidOrders, 2)
            : 0.0;

        $customers = User::query()
            ->where('role', Role::CUSTOMER)
            ->count();

        return [
            'kpis' => [
                'totalOrders' => $totalOrders,
                'paidOrders' => $paidOrders,
                'totalRevenue' => $totalRevenue,
                'monthRevenue' => $monthRevenue,
                'avgOrderValue' => $avgOrderValue,
                'customers' => $customers,
            ],
            'monthlySales' => $this->monthlySales(),
            'topSellingProducts' => $this->topSellingProducts(),
            'topViewedProducts' => $this->topViewedProducts(),
            'ordersByRegion' => $this->ordersByRegion(),
            'ordersByCustomer' => $this->ordersByCustomer(),
        ];
    }

    /**
     * @return array<int, array<string, int|float|string>>
     */
    private function monthlySales(int $months = 12): array
    {
        $months = max(1, $months);
        $periodStart = now()->startOfMonth()->subMonths($months - 1);
        $periodEnd = now()->endOfMonth();

        $monthExpression = $this->monthKeyExpression('orders.created_at');

        $rows = Order::query()
            ->selectRaw("{$monthExpression} as month_key, COUNT(*) as orders_count, SUM(grand_total) as revenue")
            ->where('status', 'paid')
            ->whereBetween('created_at', [$periodStart, $periodEnd])
            ->groupByRaw($monthExpression)
            ->orderByRaw($monthExpression)
            ->get();

        $indexed = $rows->keyBy('month_key');
        $data = [];
        $cursor = $periodStart;

        for ($i = 0; $i < $months; $i++) {
            $key = $cursor->format('Y-m');
            $row = $indexed->get($key);

            $data[] = [
                'month' => $key,
                'orders' => $row ? (int) $row->orders_count : 0,
                'revenue' => $row ? (float) $row->revenue : 0.0,
            ];

            $cursor = $cursor->addMonth();
        }

        return $data;
    }

    /**
     * @return array<int, array<string, int|float|string|null>>
     */
    private function topSellingProducts(int $limit = 10): array
    {
        $rows = OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->leftJoin('products', 'products.id', '=', 'order_items.product_id')
            ->where('orders.status', 'paid')
            ->whereNull('orders.deleted_at')
            ->selectRaw('order_items.product_id, order_items.title_snapshot, products.title as product_title, SUM(order_items.qty) as qty, SUM(order_items.line_total) as revenue')
            ->groupBy('order_items.product_id', 'order_items.title_snapshot', 'products.title')
            ->orderByDesc('qty')
            ->limit($limit)
            ->get();

        return $rows->map(function ($row): array {
            $title = $row->product_title ?: $row->title_snapshot ?: 'Silinmiş Ürün';

            return [
                'productId' => $row->product_id ? (int) $row->product_id : null,
                'title' => $title,
                'qty' => (int) $row->qty,
                'revenue' => (float) $row->revenue,
            ];
        })->all();
    }

    /**
     * @return array<int, array<string, int|string>>
     */
    private function topViewedProducts(int $limit = 10): array
    {
        return Product::query()
            ->select(['id', 'title', 'views_count'])
            ->orderByDesc('views_count')
            ->limit($limit)
            ->get()
            ->map(fn (Product $product): array => [
                'id' => $product->id,
                'title' => $product->title,
                'views' => (int) ($product->views_count ?? 0),
            ])
            ->all();
    }

    /**
     * @return array<int, array<string, int|string|null>>
     */
    private function ordersByRegion(int $limit = 10): array
    {
        $rows = OrderAddress::query()
            ->selectRaw('city, district, COUNT(*) as orders_count')
            ->where('type', 'shipping')
            ->whereHas('order', function ($query) {
                $query->whereNotIn('status', self::EXCLUDED_STATUSES);
            })
            ->groupBy('city', 'district')
            ->orderByDesc('orders_count')
            ->limit($limit)
            ->get();

        return $rows->map(fn ($row): array => [
            'city' => $row->city ?: 'Bilinmiyor',
            'district' => $row->district ?: 'Merkez',
            'orders' => (int) $row->orders_count,
        ])->all();
    }

    /**
     * @return array<int, array<string, int|float|string|null>>
     */
    private function ordersByCustomer(int $limit = 10): array
    {
        $rows = Order::query()
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->whereNotIn('orders.status', self::EXCLUDED_STATUSES)
            ->selectRaw("orders.user_id, COALESCE(users.name, 'Misafir') as name, COUNT(*) as orders_count, SUM(orders.grand_total) as revenue")
            ->groupBy('orders.user_id', 'users.name')
            ->orderByDesc('orders_count')
            ->limit($limit)
            ->get();

        return $rows->map(fn ($row): array => [
            'userId' => $row->user_id ? (int) $row->user_id : null,
            'name' => $row->name,
            'orders' => (int) $row->orders_count,
            'revenue' => (float) $row->revenue,
        ])->all();
    }

    private function monthKeyExpression(string $column = 'created_at'): string
    {
        $driver = DB::getDriverName();

        return match ($driver) {
            'pgsql' => "to_char({$column}, 'YYYY-MM')",
            'sqlite' => "strftime('%Y-%m', {$column})",
            default => "DATE_FORMAT({$column}, '%Y-%m')",
        };
    }
}
