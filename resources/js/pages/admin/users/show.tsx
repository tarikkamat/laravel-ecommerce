import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    Home,
    Mail,
    MapPin,
    MessageSquare,
    Pencil,
    Shield,
    ShoppingCart,
    Trash2,
    User as UserIcon,
} from 'lucide-react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader } from '@/components/ui/card';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem, PaginatedData, User } from '@/types';
import type { ProductComment } from '@/types/comment';

type UserOrderSummary = {
    id: number;
    status: string;
    currency: string;
    grandTotal: number;
    itemsCount: number;
    createdAt: string | null;
    paymentStatus?: string | null;
    shipmentStatus?: string | null;
};

interface Props {
    item: User;
    orders: PaginatedData<UserOrderSummary>;
    comments: PaginatedData<ProductComment>;
}

const roleLabels: Record<string, string> = {
    admin: 'Yönetici',
    customer: 'Müşteri',
};

const addressTypeLabels: Record<string, string> = {
    billing: 'Fatura Adresi',
    shipping: 'Teslimat Adresi',
};

const orderStatusLabels: Record<string, string> = {
    pending_payment: 'Ödeme Bekleniyor',
    paid: 'Ödendi',
    failed: 'Başarısız',
    cancelled: 'İptal',
    refunded: 'İade',
};

const paymentStatusLabels: Record<string, string> = {
    pending: 'Beklemede',
    success: 'Başarılı',
    failure: 'Başarısız',
};

const commentStatusLabels: Record<string, string> = {
    pending: 'Beklemede',
    approved: 'Onaylandı',
    rejected: 'Reddedildi',
};

export default function UsersShow({ item, orders, comments }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: admin.dashboard.index(),
        },
        {
            title: 'Kullanıcılar',
            href: admin.users.index().url,
        },
        {
            title: item.name,
            href: admin.users.show(item.id).url,
        },
    ];

    const formatDate = (dateString?: string | null) => {
        if (!dateString) {
            return '-';
        }

        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (value: number, currency: string = 'TRY') =>
        new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency,
        }).format(value);

    const formatNumber = (value: number) => new Intl.NumberFormat('tr-TR').format(value);

    const withTabParam = (url: string | null, tab: string) => {
        if (!url) {
            return null;
        }

        if (url.includes('tab=')) {
            return url;
        }

        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}tab=${tab}`;
    };

    const orderStatusBadge = (status: string) => {
        const label = orderStatusLabels[status] ?? status;
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';

        if (status === 'paid') {
            variant = 'default';
        }

        if (status === 'failed' || status === 'cancelled' || status === 'refunded') {
            variant = 'destructive';
        }

        return <Badge variant={variant}>{label}</Badge>;
    };

    const paymentBadge = (status?: string | null) => {
        if (!status) {
            return <Badge variant="secondary">-</Badge>;
        }

        const label = paymentStatusLabels[status] ?? status;
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';

        if (status === 'success') {
            variant = 'default';
        }

        if (status === 'failure') {
            variant = 'destructive';
        }

        return <Badge variant={variant}>{label}</Badge>;
    };

    const commentStatusBadge = (status: string) => {
        const label = commentStatusLabels[status] ?? status;
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';

        if (status === 'approved') {
            variant = 'default';
        }

        if (status === 'rejected') {
            variant = 'destructive';
        }

        return <Badge variant={variant}>{label}</Badge>;
    };

    const initialTab = (() => {
        if (typeof window === 'undefined') {
            return 'general';
        }

        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');

        if (tab === 'general' || tab === 'addresses' || tab === 'orders' || tab === 'comments') {
            return tab;
        }

        if (params.has('orders_page')) {
            return 'orders';
        }

        if (params.has('comments_page')) {
            return 'comments';
        }

        return 'general';
    })();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={item.name} />

            <div className="flex w-full flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight">{item.name}</h1>
                                <Badge variant={item.role === 'admin' ? 'default' : 'secondary'}>
                                    {roleLabels[item.role] || item.role}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Kullanıcı detaylarını görüntülüyorsunuz.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href={admin.users.index().url}>Kullanıcı Listesine Dön</Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">
                                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                    Sil
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent size="sm">
                                <AlertDialogHeader>
                                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                        <Trash2 />
                                    </AlertDialogMedia>
                                    <AlertDialogTitle>Kullanıcıyı sil?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Bu işlem "{item.name}" kullanıcısını kalıcı olarak silecektir.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel variant="outline">İptal</AlertDialogCancel>
                                    <AlertDialogAction
                                        variant="destructive"
                                        onClick={() => router.delete(admin.users.destroy(item.id).url)}
                                    >
                                        Sil
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button asChild>
                            <Link href={admin.users.edit(item.id).url}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Düzenle
                            </Link>
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Content */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <Tabs defaultValue={initialTab}>
                            <CardHeader className="pb-0">
                                <div className="overflow-x-auto">
                                    <TabsList className="min-w-max justify-start gap-1">
                                        <TabsTrigger value="general">
                                            <UserIcon className="mr-1.5 h-4 w-4" />
                                            Genel Bilgiler
                                        </TabsTrigger>
                                        <TabsTrigger value="addresses">
                                            <MapPin className="mr-1.5 h-4 w-4" />
                                            Adresler ({item.addresses?.length || 0})
                                        </TabsTrigger>
                                        <TabsTrigger value="orders">
                                            <ShoppingCart className="mr-1.5 h-4 w-4" />
                                            Siparişler ({orders.total})
                                        </TabsTrigger>
                                        <TabsTrigger value="comments">
                                            <MessageSquare className="mr-1.5 h-4 w-4" />
                                            Yorumlar ({comments.total})
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <TabsContent value="general" className="mt-0 space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Ad Soyad</Label>
                                        <p className="text-sm font-medium">{item.name}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">E-posta Adresi</Label>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium">{item.email}</p>
                                            {item.email_verified_at && (
                                                <Badge variant="outline" className="text-xs">
                                                    Doğrulanmış
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Rol</Label>
                                        <div>
                                            <Badge variant={item.role === 'admin' ? 'default' : 'secondary'}>
                                                {roleLabels[item.role] || item.role}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">İki Faktörlü Doğrulama</Label>
                                        <p className="text-sm">
                                            {item.two_factor_confirmed_at ? (
                                                <Badge variant="outline" className="text-xs text-green-600">
                                                    Aktif
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground italic">Pasif</span>
                                            )}
                                        </p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="addresses" className="mt-0 space-y-4">
                                    {item.addresses && item.addresses.length > 0 ? (
                                        item.addresses.map((address) => (
                                            <div
                                                key={address.id}
                                                className="rounded-lg border p-4 space-y-3"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <Badge variant="outline">
                                                        {addressTypeLabels[address.type] || address.type}
                                                    </Badge>
                                                </div>
                                                {address.contact_name && (
                                                    <div className="text-sm">
                                                        <span className="text-muted-foreground">İletişim: </span>
                                                        <span className="font-medium">{address.contact_name}</span>
                                                    </div>
                                                )}
                                                <div className="text-sm">
                                                    <span className="text-muted-foreground">Adres: </span>
                                                    <span>{address.address}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm">
                                                    {address.city && (
                                                        <div>
                                                            <span className="text-muted-foreground">Şehir: </span>
                                                            <span>{address.city}</span>
                                                        </div>
                                                    )}
                                                    {address.zip_code && (
                                                        <div>
                                                            <span className="text-muted-foreground">Posta Kodu: </span>
                                                            <span>{address.zip_code}</span>
                                                        </div>
                                                    )}
                                                    {address.country && (
                                                        <div>
                                                            <span className="text-muted-foreground">Ülke: </span>
                                                            <span>{address.country}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Home className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">Henüz kayıtlı adres bulunmuyor.</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="orders" className="mt-0 space-y-4">
                                    {orders.total > 0 && (
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <p className="text-sm text-muted-foreground">
                                                Son siparişler
                                            </p>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link
                                                    href={admin.orders.index({
                                                        query: { customer: item.email },
                                                    }).url}
                                                >
                                                    Tümünü Gör
                                                </Link>
                                            </Button>
                                        </div>
                                    )}

                                    {orders.data.length > 0 ? (
                                        <>
                                            <div className="rounded-lg border">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Sipariş</TableHead>
                                                            <TableHead>Tarih</TableHead>
                                                            <TableHead>Durum</TableHead>
                                                            <TableHead>Ödeme</TableHead>
                                                            <TableHead className="text-right">Adet</TableHead>
                                                            <TableHead className="text-right">Toplam</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {orders.data.map((order) => (
                                                            <TableRow key={order.id}>
                                                                <TableCell>
                                                                    <Link
                                                                        href={admin.orders.show(order.id).url}
                                                                        className="font-medium hover:underline"
                                                                    >
                                                                        #{order.id}
                                                                    </Link>
                                                                </TableCell>
                                                                <TableCell className="text-sm text-muted-foreground">
                                                                    {formatDate(order.createdAt)}
                                                                </TableCell>
                                                                <TableCell>{orderStatusBadge(order.status)}</TableCell>
                                                                <TableCell>{paymentBadge(order.paymentStatus)}</TableCell>
                                                                <TableCell className="text-right">
                                                                    {formatNumber(order.itemsCount)}
                                                                </TableCell>
                                                                <TableCell className="text-right font-medium">
                                                                    {formatCurrency(order.grandTotal, order.currency)}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            {orders.last_page > 1 && (
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <p className="text-sm text-muted-foreground">
                                                        {orders.from} - {orders.to} / {orders.total} kayıt gösteriliyor
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {orders.links.map((link, index) => {
                                                            const url = withTabParam(link.url, 'orders');

                                                            return (
                                                                <Button
                                                                    key={index}
                                                                    variant={link.active ? 'default' : 'outline'}
                                                                    size="sm"
                                                                    disabled={!url}
                                                                    asChild={!!url}
                                                                >
                                                                    {url ? (
                                                                        <Link
                                                                            href={url}
                                                                            preserveScroll
                                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                                        />
                                                                    ) : (
                                                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                                    )}
                                                                </Button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Empty className="border-dashed">
                                            <EmptyHeader>
                                                <EmptyMedia variant="icon">
                                                    <ShoppingCart className="h-5 w-5" />
                                                </EmptyMedia>
                                                <EmptyTitle>Sipariş bulunamadı</EmptyTitle>
                                                <EmptyDescription>
                                                    Bu kullanıcıya ait sipariş kaydı yok.
                                                </EmptyDescription>
                                            </EmptyHeader>
                                        </Empty>
                                    )}
                                </TabsContent>

                                <TabsContent value="comments" className="mt-0 space-y-4">
                                    {comments.data.length > 0 ? (
                                        <>
                                            <div className="rounded-lg border">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Ürün</TableHead>
                                                            <TableHead>Yorum</TableHead>
                                                            <TableHead>Durum</TableHead>
                                                            <TableHead className="text-right">Tarih</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {comments.data.map((comment) => (
                                                            <TableRow key={comment.id}>
                                                                <TableCell>
                                                                    {comment.product ? (
                                                                        <Link
                                                                            href={admin.products.show(comment.product.id).url}
                                                                            className="font-medium hover:underline"
                                                                        >
                                                                            {comment.product.title}
                                                                        </Link>
                                                                    ) : (
                                                                        <span className="text-muted-foreground">-</span>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="max-w-[320px]">
                                                                    <p className="line-clamp-2 text-sm text-foreground">
                                                                        {comment.body}
                                                                    </p>
                                                                    {comment.parent_id && (
                                                                        <Badge variant="outline" className="mt-1">
                                                                            Yanıt
                                                                        </Badge>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>{commentStatusBadge(comment.status)}</TableCell>
                                                                <TableCell className="text-right text-sm text-muted-foreground">
                                                                    {formatDate(comment.created_at)}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            {comments.last_page > 1 && (
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <p className="text-sm text-muted-foreground">
                                                        {comments.from} - {comments.to} / {comments.total} kayıt gösteriliyor
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {comments.links.map((link, index) => {
                                                            const url = withTabParam(link.url, 'comments');

                                                            return (
                                                                <Button
                                                                    key={index}
                                                                    variant={link.active ? 'default' : 'outline'}
                                                                    size="sm"
                                                                    disabled={!url}
                                                                    asChild={!!url}
                                                                >
                                                                    {url ? (
                                                                        <Link
                                                                            href={url}
                                                                            preserveScroll
                                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                                        />
                                                                    ) : (
                                                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                                    )}
                                                                </Button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Empty className="border-dashed">
                                            <EmptyHeader>
                                                <EmptyMedia variant="icon">
                                                    <MessageSquare className="h-5 w-5" />
                                                </EmptyMedia>
                                                <EmptyTitle>Yorum bulunamadı</EmptyTitle>
                                                <EmptyDescription>
                                                    Bu kullanıcı henüz yorum bırakmamış.
                                                </EmptyDescription>
                                            </EmptyHeader>
                                        </Empty>
                                    )}
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                <Label className="font-semibold">Hesap Bilgileri</Label>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground truncate">{item.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                        {item.addresses?.length || 0} kayıtlı adres
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <Label className="font-semibold">Tarih Bilgileri</Label>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Kayıt Tarihi:</span>
                                    <span>{formatDate(item.created_at)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Güncelleme:</span>
                                    <span>{formatDate(item.updated_at)}</span>
                                </div>
                                {item.email_verified_at && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">E-posta Doğrulama:</span>
                                        <span>{formatDate(item.email_verified_at)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
