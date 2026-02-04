import { Head, Link, router } from '@inertiajs/react';
import { Eye, FileDown, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { formatPrice } from '@/lib/utils';
import type { BreadcrumbItem, OrderListItem, PaginatedData } from '@/types';

type SelectOption = {
    value: string;
    label: string;
};

interface Props {
    items: PaginatedData<OrderListItem>;
    filters: {
        status?: string;
        payment_status?: string;
        order_id?: string;
        customer?: string;
        date_from?: string;
        date_to?: string;
    };
    statusOptions: SelectOption[];
    paymentStatusOptions: SelectOption[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: admin.dashboard.index(),
    },
    {
        title: 'Siparişler',
        href: admin.orders.index().url,
    },
];

const statusLabels: Record<string, string> = {
    pending_payment: 'Ödeme Bekleniyor',
    paid: 'Ödendi',
    failed: 'Başarısız',
    cancelled: 'İptal',
    refunded: 'İade',
};

const paymentLabels: Record<string, string> = {
    pending: 'Beklemede',
    success: 'Başarılı',
    failure: 'Başarısız',
};

const getCsrfToken = (): string => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta?.getAttribute('content') ?? '';
};

export default function OrdersIndex({ items, filters, statusOptions, paymentStatusOptions }: Props) {
    const [form, setForm] = useState({
        status: filters.status || 'all',
        payment_status: filters.payment_status || 'all',
        order_id: filters.order_id ?? '',
        customer: filters.customer ?? '',
        date_from: filters.date_from ?? '',
        date_to: filters.date_to ?? '',
    });
    const [selectedShipments, setSelectedShipments] = useState<number[]>([]);

    const selectableShipmentIds = useMemo(() => {
        return items.data
            .filter((order) => order.shipmentId && order.shipmentProvider === 'geliver')
            .map((order) => order.shipmentId as number);
    }, [items.data]);

    const allSelected = selectableShipmentIds.length > 0 && selectableShipmentIds.every((id) => selectedShipments.includes(id));

    const applyFilters = () => {
        const payload = {
            ...form,
            status: form.status === 'all' ? '' : form.status,
            payment_status: form.payment_status === 'all' ? '' : form.payment_status,
        };

        router.get(admin.orders.index().url, payload, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        const cleared = {
            status: 'all',
            payment_status: 'all',
            order_id: '',
            customer: '',
            date_from: '',
            date_to: '',
        };
        setForm(cleared);
        router.get(admin.orders.index().url, { ...cleared, status: '', payment_status: '' }, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const toggleShipment = (shipmentId?: number | null) => {
        if (!shipmentId) return;
        setSelectedShipments((prev) =>
            prev.includes(shipmentId) ? prev.filter((id) => id !== shipmentId) : [...prev, shipmentId]
        );
    };

    const toggleAll = () => {
        if (allSelected) {
            setSelectedShipments([]);
            return;
        }
        setSelectedShipments(selectableShipmentIds);
    };

    const handleBulkDownload = async () => {
        if (selectedShipments.length === 0) return;

        try {
            const response = await fetch(admin.orders.shipmentLabels().url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
                body: JSON.stringify({ shipment_ids: selectedShipments }),
            });

            if (!response.ok) {
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'kargo-fisleri.zip';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Bulk label download failed:', error);
        }
    };

    const statusBadge = (status: string) => {
        const label = statusLabels[status] ?? status;
        let variant: 'default' | 'secondary' | 'destructive' = 'secondary';

        if (status === 'paid') variant = 'default';
        if (status === 'failed' || status === 'cancelled' || status === 'refunded') variant = 'destructive';

        return <Badge variant={variant}>{label}</Badge>;
    };

    const paymentBadge = (status?: string | null) => {
        if (!status) return <Badge variant="secondary">-</Badge>;
        const label = paymentLabels[status] ?? status;
        let variant: 'default' | 'secondary' | 'destructive' = 'secondary';
        if (status === 'success') variant = 'default';
        if (status === 'failure') variant = 'destructive';
        return <Badge variant={variant}>{label}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Siparişler" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Siparişler</h1>
                        <p className="text-muted-foreground">Toplam {items.total} sipariş bulunmaktadır.</p>
                    </div>
                    <Button
                        onClick={handleBulkDownload}
                        disabled={selectedShipments.length === 0}
                        variant="outline"
                    >
                        <FileDown className="mr-2 h-4 w-4" />
                        Kargo Fişi İndir
                    </Button>
                </div>

                <div className="rounded-lg border p-4">
                    <div className="grid gap-4 md:grid-cols-6">
                        <Input
                            placeholder="Sipariş ID"
                            value={form.order_id}
                            onChange={(event) => setForm((prev) => ({ ...prev, order_id: event.target.value }))}
                        />
                        <Input
                            placeholder="Müşteri"
                            value={form.customer}
                            onChange={(event) => setForm((prev) => ({ ...prev, customer: event.target.value }))}
                        />
                        <Select
                            value={form.status}
                            onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sipariş Durumu" />
                            </SelectTrigger>
                            <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={form.payment_status}
                            onValueChange={(value) => setForm((prev) => ({ ...prev, payment_status: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Ödeme Durumu" />
                            </SelectTrigger>
                            <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                                {paymentStatusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            type="date"
                            value={form.date_from}
                            onChange={(event) => setForm((prev) => ({ ...prev, date_from: event.target.value }))}
                        />
                        <Input
                            type="date"
                            value={form.date_to}
                            onChange={(event) => setForm((prev) => ({ ...prev, date_to: event.target.value }))}
                        />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <Button onClick={applyFilters}>Filtrele</Button>
                        <Button variant="outline" onClick={clearFilters}>
                            Temizle
                        </Button>
                    </div>
                </div>

                {items.data.length === 0 ? (
                    <Empty className="flex-1 border">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <ShoppingCart className="h-6 w-6" />
                            </EmptyMedia>
                            <EmptyTitle>Henüz sipariş bulunmuyor</EmptyTitle>
                            <EmptyDescription>Siparişler burada listelenecek.</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[44px]">
                                        <Checkbox
                                            checked={allSelected}
                                            onCheckedChange={toggleAll}
                                            aria-label="Tüm kargoları seç"
                                        />
                                    </TableHead>
                                    <TableHead className="w-[80px]">ID</TableHead>
                                    <TableHead>Müşteri</TableHead>
                                    <TableHead>Tutar</TableHead>
                                    <TableHead>Ürün</TableHead>
                                    <TableHead>Sipariş Durumu</TableHead>
                                    <TableHead>Ödeme</TableHead>
                                    <TableHead>Kargo</TableHead>
                                    <TableHead className="w-[120px] text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.data.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={order.shipmentId ? selectedShipments.includes(order.shipmentId) : false}
                                                onCheckedChange={() => toggleShipment(order.shipmentId)}
                                                disabled={!order.shipmentId || order.shipmentProvider !== 'geliver'}
                                                aria-label={`Sipariş ${order.id} seç`}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">#{order.id}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {order.customer?.name ?? 'Misafir'}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {order.customer?.email ?? '-'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatPrice(order.grandTotal)} {order.currency}</TableCell>
                                        <TableCell>{order.itemsCount} ürün</TableCell>
                                        <TableCell>{statusBadge(order.status)}</TableCell>
                                        <TableCell>{paymentBadge(order.paymentStatus)}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{order.shipmentStatus ?? '-'}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {order.trackingNumber ?? ''}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={admin.orders.show(order.id).url}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                {order.shipmentId && order.shipmentProvider === 'geliver' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            window.location.href = admin.orders.shipmentLabel({
                                                                order: order.id,
                                                                shipment: order.shipmentId as number,
                                                            }).url;
                                                        }}
                                                    >
                                                        <FileDown className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {items.data.length > 0 && items.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {items.from} - {items.to} / {items.total} kayıt gösteriliyor
                        </p>
                        <div className="flex items-center gap-2">
                            {items.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    asChild={!!link.url}
                                >
                                    {link.url ? (
                                        <Link href={link.url} preserveScroll dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ) : (
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
