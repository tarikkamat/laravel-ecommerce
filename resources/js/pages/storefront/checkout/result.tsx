import StorefrontLayout from '@/layouts/storefront/storefront-layout';
import { Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import type { SharedData } from '@/types';

type OrderItem = {
    id: number;
    title: string;
    qty: number;
    lineTotal: number;
};

type OrderSummary = {
    id: number;
    status: string;
    currency: string;
    subtotal: number;
    taxTotal: number;
    shippingTotal: number;
    grandTotal: number;
    items: OrderItem[];
};

type FlashProps = {
    paymentStatus?: string | null;
    orderId?: number | null;
};

type ResultPageProps = {
    order: OrderSummary;
    paymentStatus?: string | null;
    apiEndpoints: {
        cartPage: string;
        checkoutPage: string;
        productsPage: string;
    };
};

export default function CheckoutResultPage({ order, paymentStatus, apiEndpoints }: ResultPageProps) {
    const { flash, storefrontSettings } = usePage<SharedData & { flash?: FlashProps }>().props;
    const pricesIncludeTax = storefrontSettings?.tax?.prices_include_tax ?? false;
    const statusFromCallback = paymentStatus ?? flash?.paymentStatus;

    const formatMoney = useMemo(
        () =>
            (value: number) =>
                `${new Intl.NumberFormat('tr-TR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(value ?? 0)} TL`,
        [],
    );

    const isPaid = order.status === 'paid' || statusFromCallback === 'success';

    return (
        <StorefrontLayout title="Siparis Sonucu">
            <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10">
                <div className={`rounded border px-4 py-4 text-sm ${isPaid ? 'border-green-600 text-green-700' : 'border-red-600 text-red-700'}`}>
                    {isPaid ? 'Odemeniz alindi. Tesekkur ederiz.' : 'Odeme tamamlanamadi.'}
                    <span className="ml-2 font-medium">Siparis: #{order.id}</span>
                </div>

                <div className="rounded border p-4">
                    <div className="mb-3 text-sm font-medium">Siparis Ozeti</div>

                    <div className="space-y-2">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                                <span>
                                    {item.title} x {item.qty}
                                </span>
                                <span className="font-medium">{formatMoney(item.lineTotal)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="my-3 h-px bg-border" />

                    <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between">
                            <span>Ara Toplam</span>
                            <span>{formatMoney(order.subtotal)}</span>
                        </div>
                        {!pricesIncludeTax ? (
                            <div className="flex items-center justify-between">
                                <span>Vergi</span>
                                <span>{formatMoney(order.taxTotal)}</span>
                            </div>
                        ) : null}
                        <div className="flex items-center justify-between">
                            <span>Kargo</span>
                            <span>{formatMoney(order.shippingTotal)}</span>
                        </div>
                    </div>

                    <div className="my-3 h-px bg-border" />

                    <div className="flex items-center justify-between text-base font-semibold">
                        <span>Genel Toplam</span>
                        <span>{formatMoney(order.grandTotal)}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Link href={apiEndpoints.productsPage} className="rounded bg-black px-4 py-2 text-sm font-medium text-white">
                        Alisverise Devam Et
                    </Link>
                    <Link href={apiEndpoints.cartPage} className="rounded border px-4 py-2 text-sm">
                        Sepete Git
                    </Link>
                    {!isPaid ? (
                        <Link href={apiEndpoints.checkoutPage} className="rounded border px-4 py-2 text-sm">
                            Checkout'a Don
                        </Link>
                    ) : null}
                </div>
            </div>
        </StorefrontLayout>
    );
}
