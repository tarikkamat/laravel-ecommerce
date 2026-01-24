import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Hash, Info, Pencil, Percent, Trash2 } from 'lucide-react';

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
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem, Discount } from '@/types';

interface Props {
    item: Discount;
}

const typeLabels: Record<string, string> = {
    percentage: 'Yüzde',
    fixed_amount: 'Sabit Tutar',
};

export default function DiscountsShow({ item }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: admin.dashboard.index(),
        },
        {
            title: 'İndirimler',
            href: admin.discounts.index().url,
        },
        {
            title: item.title,
            href: admin.discounts.show(item.id).url,
        },
    ];

    const formatDate = (dateString: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatValue = () => {
        if (item.type === 'percentage') {
            return `%${item.value}`;
        }
        return `₺${item.value.toFixed(2)}`;
    };

    const isActive = () => {
        const now = new Date();
        const startsAt = item.starts_at ? new Date(item.starts_at) : null;
        const endsAt = item.ends_at ? new Date(item.ends_at) : null;

        if (startsAt && now < startsAt) return false;
        if (endsAt && now > endsAt) return false;
        return true;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={item.title} />

            <div className="flex w-full flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight">{item.title}</h1>
                                <Badge variant={isActive() ? 'default' : 'secondary'}>
                                    {isActive() ? 'Aktif' : 'Pasif'}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                İndirim detaylarını görüntülüyorsunuz.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href={admin.discounts.index().url}>İndirim Listesine Dön</Link>
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
                                    <AlertDialogTitle>İndirimi sil?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Bu işlem "{item.title}" indirimini kalıcı olarak silecektir.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel variant="outline">İptal</AlertDialogCancel>
                                    <AlertDialogAction
                                        variant="destructive"
                                        onClick={() => router.delete(admin.discounts.destroy(item.id).url)}
                                    >
                                        Sil
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button asChild>
                            <Link href={admin.discounts.edit(item.id).url}>
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
                        <Tabs defaultValue="general">
                            <CardHeader className="pb-0">
                                <TabsList>
                                    <TabsTrigger value="general">
                                        <Info className="mr-1.5 h-4 w-4" />
                                        Genel Bilgiler
                                    </TabsTrigger>
                                    <TabsTrigger value="validity">
                                        <Calendar className="mr-1.5 h-4 w-4" />
                                        Geçerlilik
                                    </TabsTrigger>
                                </TabsList>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <TabsContent value="general" className="mt-0 space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">İndirim Başlığı</Label>
                                        <p className="text-sm font-medium">{item.title}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Açıklama</Label>
                                        <p className="text-sm whitespace-pre-wrap">
                                            {item.description || (
                                                <span className="text-muted-foreground italic">
                                                    Açıklama girilmemiş
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">İndirim Tipi</Label>
                                            <div>
                                                <Badge variant="outline">
                                                    {typeLabels[item.type] || item.type}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">İndirim Değeri</Label>
                                            <p className="text-lg font-bold text-primary">
                                                {formatValue()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Kupon Kodu</Label>
                                        {item.code ? (
                                            <code className="block rounded bg-muted px-3 py-2 text-sm font-mono">
                                                {item.code}
                                            </code>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">
                                                Kupon kodu tanımlanmamış
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Kullanım Limiti</Label>
                                        <p className="text-sm">
                                            {item.usage_limit !== null ? (
                                                <span className="font-medium">{item.usage_limit} kullanım</span>
                                            ) : (
                                                <span className="text-muted-foreground italic">
                                                    Sınırsız
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="validity" className="mt-0 space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Başlangıç Tarihi</Label>
                                        <p className="text-sm">
                                            {formatDate(item.starts_at) || (
                                                <span className="text-muted-foreground italic">
                                                    Belirtilmemiş (hemen geçerli)
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Bitiş Tarihi</Label>
                                        <p className="text-sm">
                                            {formatDate(item.ends_at) || (
                                                <span className="text-muted-foreground italic">
                                                    Belirtilmemiş (süresiz)
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Durum</Label>
                                        <div>
                                            <Badge variant={isActive() ? 'default' : 'secondary'}>
                                                {isActive() ? 'Aktif' : 'Pasif'}
                                            </Badge>
                                        </div>
                                    </div>
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Percent className="h-4 w-4 text-primary" />
                                <Label className="font-semibold">İndirim Özeti</Label>
                            </div>
                            <div className="rounded-lg border p-4 space-y-3">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-primary">{formatValue()}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {typeLabels[item.type] || item.type}
                                    </p>
                                </div>
                                {item.code && (
                                    <div className="pt-2 border-t">
                                        <p className="text-xs text-muted-foreground text-center mb-1">Kupon Kodu</p>
                                        <code className="block text-center rounded bg-muted px-2 py-1 text-sm font-mono">
                                            {item.code}
                                        </code>
                                    </div>
                                )}
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
                                    <span className="text-muted-foreground">Oluşturulma:</span>
                                    <span>{formatDate(item.created_at)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Güncelleme:</span>
                                    <span>{formatDate(item.updated_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
