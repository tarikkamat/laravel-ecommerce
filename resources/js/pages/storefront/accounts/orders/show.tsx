import StorefrontLayout from '@/layouts/storefront/storefront-layout';
import { Link } from '@inertiajs/react';
import { useMemo } from 'react';

type OrderItem = {
    id: number;
    title: string;
    qty: number;
    unitPrice: number;
    lineTotal: number;
};

type TaxLine = {
    id: number;
    name: string;
    rate: number;
    baseAmount: number;
    taxAmount: number;
    scope: string;
};

type Shipment = {
    id: number;
    provider: string;
    serviceName: string | null;
    serviceCode: string | null;
    status: string;
    trackingNumber: string | null;
    shippingTotal: number;
};

type Address = {
    id: number;
    type: string;
    fullName: string;
    phone: string | null;
    country: string;
    city: string;
    district: string | null;
    line1: string;
    line2: string | null;
    postalCode: string | null;
};

type Payment = {
    id: number;
    provider: string;
    status: string;
    amount: number;
    conversationId: string | null;
    transactionId: string | null;
    createdAt: string | null;
};

type OrderDetail = {
    id: number;
    status: string;
    currency: string;
    subtotal: number;
    taxTotal: number;
    shippingTotal: number;
    grandTotal: number;
    createdAt: string | null;
    items: OrderItem[];
    taxLines: TaxLine[];
    shipments: Shipment[];
    addresses: Address[];
    payments: Payment[];
};

type OrdersShowProps = {
    order: OrderDetail;
    apiEndpoints: {
        ordersIndex: string;
        orderShow: string;
    };
};

export default function OrdersShowPage({ order, apiEndpoints }: OrdersShowProps) {
    const mapShipmentStatus = (status: string) => {
        const key = (status || '').toUpperCase();

        if (key.includes('DELIVER')) return 'Teslim edildi';
        if (key.includes('RETURN')) return 'İade sürecinde';
        if (key.includes('CANCEL')) return 'İptal edildi';
        if (key.includes('FAIL')) return 'Kargo hatası';
        if (key.includes('ACCEPT')) return 'Kargoya verildi';
        if (key.includes('TRANSIT') || key.includes('OUT_FOR_DELIVERY')) return 'Dağıtımda';
        if (key.includes('TRACK_UPDATED') || key.includes('TRACK')) return 'Kargoda';
        if (key.includes('OFFER_ACCEPT_FAILED')) return 'Kargo onayı bekleniyor';
        if (key.includes('DRAFT')) return 'Hazırlanıyor';

        return status || 'Bilinmiyor';
    };

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
            (value: number) =>
                `${new Intl.NumberFormat('tr-TR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(value ?? 0)} TL`,
        [],
    );

    return (
        <StorefrontLayout title={`Siparis #${order.id}`}>
            <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Siparis #{order.id}</h1>
                        <div className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</div>
                    </div>
                    <Link href={apiEndpoints.ordersIndex} className="text-sm underline">
                        Siparislerime Don
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        {order.shipments.length > 0 ? (
                            <div className="rounded border border-emerald-600/40 bg-emerald-50/60 p-4 text-sm dark:border-emerald-500/40 dark:bg-emerald-950/20">
                                <div className="mb-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                    Kargo Durumu
                                </div>
                                {order.shipments.map((shipment) => (
                                    <div key={shipment.id} className="grid gap-1 text-xs sm:grid-cols-2">
                                        <div>
                                            <span className="text-muted-foreground">Servis: </span>
                                            <span className="font-medium">
                                                {shipment.provider} / {shipment.serviceName || shipment.serviceCode}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Durum: </span>
                                            <span className="font-medium">{mapShipmentStatus(shipment.status)}</span>
                                        </div>
                                        {shipment.trackingNumber ? (
                                            <div className="sm:col-span-2">
                                                <span className="text-muted-foreground">Takip No: </span>
                                                <span className="font-medium">{shipment.trackingNumber}</span>
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        <div className="rounded border p-4">
                            <div className="mb-3 text-sm font-medium">Urunler</div>
                            <div className="space-y-2">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between text-sm">
                                        <div>
                                            <div className="font-medium">{item.title}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.qty} x {formatMoney(item.unitPrice)}
                                            </div>
                                        </div>
                                        <div className="font-medium">{formatMoney(item.lineTotal)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded border p-4">
                            <div className="mb-3 text-sm font-medium">Adresler</div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {order.addresses.map((address) => (
                                    <div key={address.id} className="rounded border p-3 text-xs">
                                        <div className="mb-1 text-[11px] font-medium uppercase text-muted-foreground">
                                            {address.type}
                                        </div>
                                        <div className="font-medium">{address.fullName}</div>
                                        {address.phone ? <div>{address.phone}</div> : null}
                                        <div>
                                            {address.line1}
                                            {address.line2 ? `, ${address.line2}` : ''}
                                        </div>
                                        <div>
                                            {address.district ? `${address.district}, ` : ''}
                                            {address.city}
                                        </div>
                                        <div>
                                            {address.postalCode ? `${address.postalCode}, ` : ''}
                                            {address.country}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded border p-4">
                            <div className="mb-2 text-sm font-medium">Durum</div>
                            <div className="inline-flex rounded border px-2 py-1 text-xs">{order.status}</div>
                        </div>

                        <div className="rounded border p-4">
                            <div className="mb-2 text-sm font-medium">Tutarlar</div>
                            <div className="space-y-1 text-sm">
                                <div className="flex items-center justify-between">
                                    <span>Ara Toplam</span>
                                    <span>{formatMoney(order.subtotal)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Vergi</span>
                                    <span>{formatMoney(order.taxTotal)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Kargo</span>
                                    <span>{formatMoney(order.shippingTotal)}</span>
                                </div>
                            </div>
                            <div className="my-2 h-px bg-border" />
                            <div className="flex items-center justify-between text-base font-semibold">
                                <span>Genel Toplam</span>
                                <span>{formatMoney(order.grandTotal)}</span>
                            </div>
                        </div>

                        {order.payments.length > 0 ? (
                            <div className="rounded border p-4 text-sm">
                                <div className="mb-2 text-sm font-medium">Odeme</div>
                                {order.payments.map((payment) => (
                                    <div key={payment.id} className="space-y-1 text-xs">
                                        <div>
                                            {payment.provider} / {payment.status}
                                        </div>
                                        <div>{formatMoney(payment.amount)}</div>
                                        {payment.transactionId ? <div>Islem: {payment.transactionId}</div> : null}
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
