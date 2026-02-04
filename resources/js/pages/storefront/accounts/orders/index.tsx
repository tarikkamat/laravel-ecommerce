import StorefrontLayout from '@/layouts/storefront/storefront-layout';
import { Link } from '@inertiajs/react';
import { useMemo } from 'react';

type OrderListItem = {
    id: number;
    status: string;
    currency: string;
    grandTotal: number;
    itemsCount: number;
    createdAt: string | null;
    shipment: {
        serviceName: string | null;
        trackingNumber: string | null;
    } | null;
};

type OrdersIndexProps = {
    orders: OrderListItem[];
    apiEndpoints: {
        ordersIndex: string;
        orderShow: string;
        productsPage: string;
    };
};

export default function OrdersIndexPage({ orders, apiEndpoints }: OrdersIndexProps) {
    const formatDate = useMemo(
        () =>
            (iso: string | null) =>
                iso
                    ? new Intl.DateTimeFormat('tr-TR', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                      }).format(new Date(iso))
                    : '-',
        [],
    );

    const formatMoney = useMemo(
        () =>
            (value: number, currency: string) =>
                new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: currency || 'TRY',
                }).format(value ?? 0),
        [],
    );

    return (
        <StorefrontLayout title="Siparislerim">
            <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Siparislerim</h1>
                    <Link href={apiEndpoints.productsPage} className="text-sm underline">
                        Alisverise Don
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="rounded border p-6 text-sm text-muted-foreground">
                        Henuz siparisiniz yok.
                    </div>
                ) : (
                    <div className="overflow-hidden rounded border">
                        <div className="grid grid-cols-[1.1fr_1fr_0.8fr_1fr_0.9fr] gap-3 border-b bg-muted/40 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            <div>Siparis</div>
                            <div>Tarih</div>
                            <div>Durum</div>
                            <div>Toplam</div>
                            <div className="text-right">Islem</div>
                        </div>

                        <div className="divide-y">
                            {orders.map((order) => (
                                <div key={order.id} className="grid grid-cols-[1.1fr_1fr_0.8fr_1fr_0.9fr] items-center gap-3 px-4 py-4 text-sm">
                                    <div>
                                        <div className="font-medium">#{order.id}</div>
                                        <div className="text-xs text-muted-foreground">{order.itemsCount} urun</div>
                                    </div>
                                    <div className="text-muted-foreground">{formatDate(order.createdAt)}</div>
                                    <div>
                                        <span className="rounded border px-2 py-1 text-xs">{order.status}</span>
                                    </div>
                                    <div className="font-medium">{formatMoney(order.grandTotal, order.currency)}</div>
                                    <div className="text-right">
                                        <Link
                                            href={apiEndpoints.orderShow.replace('__ORDER_ID__', String(order.id))}
                                            className="text-sm underline"
                                        >
                                            Detay
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
