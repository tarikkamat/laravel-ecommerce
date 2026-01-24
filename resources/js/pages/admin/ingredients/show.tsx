import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Globe, Info, Package, Pencil, Trash2 } from 'lucide-react';

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
import type { BreadcrumbItem, Ingredient } from '@/types';

interface Props {
    item: Ingredient;
}

export default function IngredientsShow({ item }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: admin.dashboard.index(),
        },
        {
            title: 'İçerikler',
            href: admin.ingredients.index().url,
        },
        {
            title: item.title,
            href: admin.ingredients.show(item.id).url,
        },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
        }).format(price);
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
                                <Badge variant="secondary">
                                    {item.products?.length || 0} ürün
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                İçerik detaylarını görüntülüyorsunuz.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href={admin.ingredients.index().url}>İçerik Listesine Dön</Link>
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
                                    <AlertDialogTitle>İçeriği sil?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Bu işlem "{item.title}" içeriğini kalıcı olarak silecektir.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel variant="outline">İptal</AlertDialogCancel>
                                    <AlertDialogAction
                                        variant="destructive"
                                        onClick={() => router.delete(admin.ingredients.destroy(item.id).url)}
                                    >
                                        Sil
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button asChild>
                            <Link href={admin.ingredients.edit(item.id).url}>
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
                                    <TabsTrigger value="seo">
                                        <Globe className="mr-1.5 h-4 w-4" />
                                        SEO
                                    </TabsTrigger>
                                    <TabsTrigger value="products">
                                        <Package className="mr-1.5 h-4 w-4" />
                                        Ürünler ({item.products?.length || 0})
                                    </TabsTrigger>
                                </TabsList>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <TabsContent value="general" className="mt-0 space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">İçerik Adı</Label>
                                        <p className="text-sm font-medium">{item.title}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">URL Adresi (Slug)</Label>
                                        <p className="text-sm font-medium">
                                            <span className="text-muted-foreground">
                                                suug.istanbul/icerikler/
                                            </span>
                                            {item.slug}
                                        </p>
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
                                </TabsContent>

                                <TabsContent value="seo" className="mt-0 space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">SEO Başlığı</Label>
                                        <p className="text-sm">
                                            {item.seo_title || (
                                                <span className="text-muted-foreground italic">
                                                    SEO başlığı girilmemiş
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">SEO Açıklaması</Label>
                                        <p className="text-sm whitespace-pre-wrap">
                                            {item.seo_description || (
                                                <span className="text-muted-foreground italic">
                                                    SEO açıklaması girilmemiş
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="products" className="mt-0">
                                    {item.products && item.products.length > 0 ? (
                                        <div className="rounded-lg border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Ürün</TableHead>
                                                        <TableHead>SKU</TableHead>
                                                        <TableHead>Fiyat</TableHead>
                                                        <TableHead>Durum</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {item.products.map((product) => (
                                                        <TableRow key={product.id}>
                                                            <TableCell>
                                                                <Link
                                                                    href={admin.products.show(product.id).url}
                                                                    className="font-medium text-primary hover:underline"
                                                                >
                                                                    {product.title}
                                                                </Link>
                                                            </TableCell>
                                                            <TableCell className="text-muted-foreground">
                                                                {product.sku || '-'}
                                                            </TableCell>
                                                            <TableCell>
                                                                {formatPrice(product.price)}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant={product.active ? 'default' : 'secondary'}>
                                                                    {product.active ? 'Aktif' : 'Pasif'}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">Bu içerik henüz hiçbir ürüne eklenmemiş.</p>
                                        </div>
                                    )}
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-primary" />
                                <Label className="font-semibold">İstatistikler</Label>
                            </div>
                            <div className="rounded-lg border p-4">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-primary">
                                        {item.products?.length || 0}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Bağlı Ürün
                                    </p>
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
