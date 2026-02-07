import { Head } from '@inertiajs/react';
import {
    Eye,
    FileText,
    MapPin,
    Package,
    ShoppingCart,
    User as UserIcon,
    Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
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
import type { BreadcrumbItem, DashboardData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: admin.dashboard.index(),
    },
];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
    }).format(value);

const formatNumber = (value: number) =>
    new Intl.NumberFormat('tr-TR').format(value);

const formatMonthLabel = (month: string) => {
    const date = new Date(`${month}-01T00:00:00Z`);

    return new Intl.DateTimeFormat('tr-TR', {
        month: 'short',
        year: '2-digit',
    }).format(date);
};

export default function Dashboard({
    kpis,
    monthlySales,
    topSellingProducts,
    topViewedProducts,
    ordersByRegion,
    ordersByCustomer,
}: DashboardData) {
    const maxRevenue = Math.max(
        ...monthlySales.map((entry) => entry.revenue),
        0
    );
    const chartScale = maxRevenue > 0 ? maxRevenue : 1;
    const totalMonthlyRevenue = monthlySales.reduce(
        (acc, entry) => acc + entry.revenue,
        0
    );
    const bestMonth = monthlySales.length > 0
        ? monthlySales.reduce((best, current) =>
            current.revenue > best.revenue ? current : best
        )
        : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Mağaza performansınızı hızlıca gözden geçirin.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Toplam Ciro
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Ödenmiş siparişler
                                </CardDescription>
                            </div>
                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                <FileText className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(kpis.totalRevenue)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Bu ay: {formatCurrency(kpis.monthRevenue)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Siparişler
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Aktif sipariş sayısı
                                </CardDescription>
                            </div>
                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                <ShoppingCart className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatNumber(kpis.totalOrders)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Ödenmiş: {formatNumber(kpis.paidOrders)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Ortalama Sepet
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Ödenmiş sipariş ortalaması
                                </CardDescription>
                            </div>
                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                <Package className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(kpis.avgOrderValue)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Son 12 ay: {formatCurrency(totalMonthlyRevenue)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Müşteriler
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Kayıtlı müşteri sayısı
                                </CardDescription>
                            </div>
                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                <Users className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatNumber(kpis.customers)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Üye bazlı siparişleri aşağıda görebilirsiniz
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-12">
                    <Card className="lg:col-span-8">
                        <CardHeader>
                            <CardTitle>Aylık Satış</CardTitle>
                            <CardDescription>Son 12 ayın sipariş ve ciro dağılımı</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-48 items-end gap-2">
                                {monthlySales.map((entry) => (
                                    <div
                                        key={entry.month}
                                        className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                                    >
                                        <div className="flex h-full w-full items-end">
                                            <div
                                                className="w-full rounded-md bg-primary/80 transition-all"
                                                style={{
                                                    height: `${(entry.revenue / chartScale) * 100}%`,
                                                    minHeight: entry.revenue > 0 ? '8px' : '2px',
                                                }}
                                            />
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">
                                            {formatMonthLabel(entry.month)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 grid gap-4 md:grid-cols-3">
                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">Son 12 Ay Ciro</p>
                                    <p className="text-lg font-semibold">
                                        {formatCurrency(totalMonthlyRevenue)}
                                    </p>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">Bu Ay Sipariş</p>
                                    <p className="text-lg font-semibold">
                                        {formatNumber(
                                            monthlySales[monthlySales.length - 1]?.orders ?? 0
                                        )}
                                    </p>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">En İyi Ay</p>
                                    <p className="text-lg font-semibold">
                                        {bestMonth ? formatMonthLabel(bestMonth.month) : '-'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>En Çok Satan Ürünler</CardTitle>
                            <CardDescription>Ödenmiş siparişlere göre</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {topSellingProducts.length === 0 ? (
                                <Empty className="border-dashed">
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                            <Package className="h-5 w-5" />
                                        </EmptyMedia>
                                        <EmptyTitle>Henüz satış yok</EmptyTitle>
                                        <EmptyDescription>
                                            Satışlar başladığında burada görünecek.
                                        </EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            ) : (
                                <div className="rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Ürün</TableHead>
                                                <TableHead className="text-right">Adet</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {topSellingProducts.map((item) => (
                                                <TableRow key={`${item.productId}-${item.title}`}>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">
                                                                {item.title}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatCurrency(item.revenue)}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge variant="secondary">
                                                            {formatNumber(item.qty)}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-12">
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>En Çok Tıklanan Ürünler</CardTitle>
                            <CardDescription>Ürün detay sayfası görüntülenme</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {topViewedProducts.length === 0 ? (
                                <Empty className="border-dashed">
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                            <Eye className="h-5 w-5" />
                                        </EmptyMedia>
                                        <EmptyTitle>Veri yok</EmptyTitle>
                                        <EmptyDescription>
                                            Ürünler görüntülendikçe burada listelenir.
                                        </EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            ) : (
                                <div className="rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Ürün</TableHead>
                                                <TableHead className="text-right">Tıklama</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {topViewedProducts.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">
                                                        {item.title}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge variant="secondary">
                                                            {formatNumber(item.views)}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>İl/İlçe Bazlı Sipariş</CardTitle>
                            <CardDescription>Gönderim adresine göre</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {ordersByRegion.length === 0 ? (
                                <Empty className="border-dashed">
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                            <MapPin className="h-5 w-5" />
                                        </EmptyMedia>
                                        <EmptyTitle>Veri yok</EmptyTitle>
                                        <EmptyDescription>
                                            Siparişler geldikçe dağılım burada görünür.
                                        </EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            ) : (
                                <div className="rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Lokasyon</TableHead>
                                                <TableHead className="text-right">Sipariş</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {ordersByRegion.map((item, index) => (
                                                <TableRow key={`${item.city}-${item.district}-${index}`}>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">
                                                                {item.city}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {item.district}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge variant="secondary">
                                                            {formatNumber(item.orders)}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Üye Bazlı Sipariş</CardTitle>
                            <CardDescription>En çok sipariş veren müşteriler</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {ordersByCustomer.length === 0 ? (
                                <Empty className="border-dashed">
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                            <UserIcon className="h-5 w-5" />
                                        </EmptyMedia>
                                        <EmptyTitle>Veri yok</EmptyTitle>
                                        <EmptyDescription>
                                            Siparişler geldikçe müşteri listesi oluşur.
                                        </EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            ) : (
                                <div className="rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Müşteri</TableHead>
                                                <TableHead className="text-right">Sipariş</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {ordersByCustomer.map((item, index) => (
                                                <TableRow key={`${item.userId}-${index}`}>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">
                                                                {item.name}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatCurrency(item.revenue)}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge variant="secondary">
                                                            {formatNumber(item.orders)}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
