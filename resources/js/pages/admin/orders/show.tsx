import { Head, Link, router } from '@inertiajs/react';
import { FileDown, PackageCheck, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { formatPrice } from '@/lib/utils';
import type { BreadcrumbItem, OrderDetail } from '@/types';

type SelectOption = {
    value: string;
    label: string;
};

interface Props {
    order: OrderDetail;
    statusOptions: SelectOption[];
    shipmentStatusOptions: SelectOption[];
}

const statusLabels: Record<string, string> = {
    pending_payment: 'Ödeme Bekleniyor',
    paid: 'Ödendi',
    failed: 'Başarısız',
    cancelled: 'İptal',
    refunded: 'İade',
};

export default function OrdersShow({ order, statusOptions, shipmentStatusOptions }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: admin.dashboard.index() },
        { title: 'Siparişler', href: admin.orders.index().url },
        { title: `#${order.id}`, href: admin.orders.show(order.id).url },
    ];

    const [status, setStatus] = useState(order.status);
    const [statusReason, setStatusReason] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const [refundReason, setRefundReason] = useState('');

    const canCancel = !['cancelled', 'refunded', 'paid'].includes(order.status);
    const canRefund = ['paid', 'shipped', 'delivered'].includes(order.status);

    const shipmentState = useMemo(() => {
        return order.shipments.reduce<Record<number, { status: string; tracking: string }>>((acc, shipment) => {
            acc[shipment.id] = {
                status: shipment.status ?? 'draft',
                tracking: shipment.trackingNumber ?? '',
            };
            return acc;
        }, {});
    }, [order.shipments]);

    const [shipmentUpdates, setShipmentUpdates] = useState(shipmentState);

    const formatDateTime = (value?: string | null) => {
        if (!value) return '-';
        return new Date(value).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const statusBadge = (value: string) => {
        const label = statusLabels[value] ?? value;
        let variant: 'default' | 'secondary' | 'destructive' = 'secondary';
        if (value === 'paid') variant = 'default';
        if (value === 'failed' || value === 'cancelled' || value === 'refunded') variant = 'destructive';
        return <Badge variant={variant}>{label}</Badge>;
    };

    const handleStatusUpdate = () => {
        router.put(admin.orders.update(order.id).url, {
            status,
            reason: statusReason,
        });
    };

    const handleCancel = () => {
        router.post(admin.orders.cancel(order.id).url, { reason: cancelReason });
    };

    const handleRefund = () => {
        router.post(admin.orders.refund(order.id).url, { reason: refundReason });
    };

    const handleShipmentUpdate = (shipmentId: number) => {
        const update = shipmentUpdates[shipmentId];
        router.patch(admin.orders.updateShipment({ order: order.id, shipment: shipmentId }).url, {
            shipment_status: update.status,
            tracking_number: update.tracking,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Sipariş #${order.id}`} />

            <div className="flex w-full flex-col gap-6 p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">Sipariş #{order.id}</h1>
                            {statusBadge(order.status)}
                        </div>
                        <p className="text-muted-foreground">Sipariş detaylarını görüntülüyorsunuz.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href={admin.orders.index().url}>Sipariş Listesine Dön</Link>
                        </Button>
                        {order.shipments[0] && order.shipments[0].provider === 'geliver' && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    const shipment = order.shipments[0];
                                    window.location.href = admin.orders.shipmentLabel({
                                        order: order.id,
                                        shipment: shipment.id,
                                    }).url;
                                }}
                            >
                                <FileDown className="mr-2 h-4 w-4" />
                                Kargo Fişi
                            </Button>
                        )}
                    </div>
                </div>

                <Separator />

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Sipariş Özeti</CardTitle>
                            <CardDescription>Ürünler ve toplamlar.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">{item.qty} adet</p>
                                        </div>
                                        <p className="font-medium">{formatPrice(item.lineTotal)} {order.currency}</p>
                                    </div>
                                ))}
                            </div>
                            <Separator />
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span>Ara Toplam</span>
                                    <span>{formatPrice(order.subtotal)} {order.currency}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Vergi</span>
                                    <span>{formatPrice(order.taxTotal)} {order.currency}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Kargo</span>
                                    <span>{formatPrice(order.shippingTotal)} {order.currency}</span>
                                </div>
                                <div className="flex items-center justify-between font-semibold">
                                    <span>Genel Toplam</span>
                                    <span>{formatPrice(order.grandTotal)} {order.currency}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Durum İşlemleri</CardTitle>
                            <CardDescription>Sipariş durumunu yönetin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Durum Güncelle</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Durum seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    placeholder="Neden (opsiyonel)"
                                    value={statusReason}
                                    onChange={(event) => setStatusReason(event.target.value)}
                                />
                                <Button className="w-full" onClick={handleStatusUpdate}>
                                    Durumu Güncelle
                                </Button>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label>İptal Notu</Label>
                                    <Input
                                        placeholder="İptal nedeni"
                                        value={cancelReason}
                                        onChange={(event) => setCancelReason(event.target.value)}
                                    />
                                    <Button variant="outline" className="w-full" onClick={handleCancel} disabled={!canCancel}>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Siparişi İptal Et
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <Label>İade Notu</Label>
                                    <Input
                                        placeholder="İade nedeni"
                                        value={refundReason}
                                        onChange={(event) => setRefundReason(event.target.value)}
                                    />
                                    <Button variant="outline" className="w-full" onClick={handleRefund} disabled={!canRefund}>
                                        <PackageCheck className="mr-2 h-4 w-4" />
                                        Siparişi İade Et
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Müşteri</CardTitle>
                            <CardDescription>Temel bilgiler.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div>
                                <p className="font-medium">{order.customer?.name ?? 'Misafir'}</p>
                                <p className="text-muted-foreground">{order.customer?.email ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Sipariş Tarihi</p>
                                <p className="font-medium">{formatDateTime(order.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">İptal</p>
                                <p className="font-medium">{formatDateTime(order.cancelledAt)}</p>
                                {order.cancelReason && <p className="text-xs text-muted-foreground">{order.cancelReason}</p>}
                            </div>
                            <div>
                                <p className="text-muted-foreground">İade</p>
                                <p className="font-medium">{formatDateTime(order.refundedAt)}</p>
                                {order.refundReason && <p className="text-xs text-muted-foreground">{order.refundReason}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Adresler</CardTitle>
                            <CardDescription>Fatura ve teslimat.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            {order.addresses.map((address) => (
                                <div key={address.id} className="space-y-1">
                                    <p className="font-medium capitalize">{address.type}</p>
                                    <p>{address.fullName}</p>
                                    <p>{address.line1}</p>
                                    {address.line2 && <p>{address.line2}</p>}
                                    <p>
                                        {address.city} {address.district ? `/ ${address.district}` : ''}
                                    </p>
                                    {address.postalCode && <p>{address.postalCode}</p>}
                                    {address.phone && <p>{address.phone}</p>}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ödeme</CardTitle>
                            <CardDescription>Ödeme geçmişi.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            {order.payments.length === 0 && <p>Ödeme kaydı yok.</p>}
                            {order.payments.map((payment) => (
                                <div key={payment.id} className="rounded border p-3">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium">{payment.provider}</p>
                                        <Badge variant={payment.status === 'success' ? 'default' : payment.status === 'failure' ? 'destructive' : 'secondary'}>
                                            {payment.status}
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground">{formatPrice(payment.amount)} {payment.currency}</p>
                                    {payment.transactionId && <p className="text-xs text-muted-foreground">TX: {payment.transactionId}</p>}
                                    {payment.createdAt && <p className="text-xs text-muted-foreground">{formatDateTime(payment.createdAt)}</p>}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Kargo</CardTitle>
                        <CardDescription>Gönderi bilgileri.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {order.shipments.length === 0 && <p>Kargo kaydı yok.</p>}
                        {order.shipments.map((shipment) => (
                            <div key={shipment.id} className="grid gap-3 rounded border p-4 md:grid-cols-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Servis</p>
                                    <p className="font-medium">{shipment.serviceName ?? shipment.provider}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Durum</p>
                                    <Select
                                        value={shipmentUpdates[shipment.id]?.status ?? shipment.status}
                                        onValueChange={(value) =>
                                            setShipmentUpdates((prev) => ({
                                                ...prev,
                                                [shipment.id]: {
                                                    ...prev[shipment.id],
                                                    status: value,
                                                },
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Durum seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {shipmentStatusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Takip No</p>
                                    <Input
                                        value={shipmentUpdates[shipment.id]?.tracking ?? ''}
                                        onChange={(event) =>
                                            setShipmentUpdates((prev) => ({
                                                ...prev,
                                                [shipment.id]: {
                                                    ...prev[shipment.id],
                                                    tracking: event.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </div>
                                <div className="flex items-end justify-end gap-2">
                                    <Button variant="outline" onClick={() => handleShipmentUpdate(shipment.id)}>
                                        Güncelle
                                    </Button>
                                    {shipment.provider === 'geliver' && (
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                window.location.href = admin.orders.shipmentLabel({
                                                    order: order.id,
                                                    shipment: shipment.id,
                                                }).url;
                                            }}
                                        >
                                            <FileDown className="mr-2 h-4 w-4" />
                                            Fiş
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
