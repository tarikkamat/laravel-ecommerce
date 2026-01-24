import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    FlaskConical,
    FolderTree,
    ImageIcon,
    Pencil,
    Tag,
    Trash2,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem, Product } from '@/types';

interface Props {
    item: Product;
}

export default function ProductsShow({ item }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: admin.dashboard.index(),
        },
        {
            title: 'Ürünler',
            href: admin.products.index().url,
        },
        {
            title: item.title,
            href: admin.products.show(item.id).url,
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
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">{item.title}</h1>
                            <Badge variant={item.active ? 'default' : 'secondary'}>
                                {item.active ? 'Aktif' : 'Pasif'}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">
                            Ürün detaylarını görüntülüyorsunuz.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href={admin.products.index().url}>Ürün Listesine Dön</Link>
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
                                    <AlertDialogTitle>Ürünü sil?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Bu işlem "{item.title}" ürününü kalıcı olarak silecektir.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel variant="outline">İptal</AlertDialogCancel>
                                    <AlertDialogAction
                                        variant="destructive"
                                        onClick={() => router.delete(admin.products.destroy(item.id).url)}
                                    >
                                        Sil
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button asChild>
                            <Link href={admin.products.edit(item.id).url}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Düzenle
                            </Link>
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Content */}
                <div className="space-y-6 max-w-4xl">
                    {/* Temel Bilgi */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Temel Bilgi</CardTitle>
                            <CardDescription>Ürünün temel bilgileri.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-xs">Ürün Adı</Label>
                                    <p className="text-sm font-medium">{item.title}</p>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-xs">Marka</Label>
                                    <p className="text-sm font-medium">
                                        {item.brand ? (
                                            <Link
                                                href={admin.brands.show(item.brand.id).url}
                                                className="text-primary hover:underline"
                                            >
                                                {item.brand.title}
                                            </Link>
                                        ) : (
                                            <span className="text-muted-foreground italic">-</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs">URL Adresi (Slug)</Label>
                                <p className="text-sm font-medium">
                                    <span className="text-muted-foreground">suug.istanbul/urunler/</span>
                                    {item.slug}
                                </p>
                            </div>

                            <Separator />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-xs">Satış Fiyatı</Label>
                                    <p className="text-lg font-bold text-primary">
                                        {formatPrice(item.price)}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-xs">İndirimli Fiyat</Label>
                                    {item.sale_price ? (
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg font-bold text-destructive">
                                                {formatPrice(item.sale_price)}
                                            </p>
                                            <Badge variant="destructive" className="text-[10px]">
                                                %{Math.round(((item.price - item.sale_price) / item.price) * 100)} İndirim
                                            </Badge>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">-</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs">Durum</Label>
                                <div>
                                    <Badge variant={item.active ? 'default' : 'secondary'}>
                                        {item.active ? 'Ürün aktif (satışa açık)' : 'Ürün pasif'}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Medya */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" />
                                Medya
                            </CardTitle>
                            <CardDescription>
                                {item.images?.length || 0} görsel yüklenmiş.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {item.images && item.images.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                    {item.images.map((image) => (
                                        <div
                                            key={image.id}
                                            className="relative aspect-square rounded-lg border overflow-hidden group"
                                        >
                                            <img
                                                src={`/storage/${image.path}`}
                                                alt={image.title || item.title}
                                                className="w-full h-full object-cover"
                                            />
                                            {image.title && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                                                    {image.title}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Henüz görsel eklenmemiş.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Ürün Detay */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ürün Detay</CardTitle>
                            <CardDescription>Ürün detay bilgileri.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs flex items-center gap-1.5">
                                    <Tag className="h-3.5 w-3.5" />
                                    Etiketler ({item.tags?.length || 0})
                                </Label>
                                {item.tags && item.tags.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {item.tags.map((tag) => (
                                            <Link key={tag.id} href={admin.tags.show(tag.id).url}>
                                                <Badge variant="secondary" className="hover:bg-secondary/80">
                                                    {tag.title}
                                                </Badge>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">Etiket eklenmemiş</p>
                                )}
                            </div>

                            <Separator />

                            <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs flex items-center gap-1.5">
                                    <FolderTree className="h-3.5 w-3.5" />
                                    Kategoriler ({item.categories?.length || 0})
                                </Label>
                                {item.categories && item.categories.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {item.categories.map((category) => (
                                            <Link
                                                key={category.id}
                                                href={admin.categories.show(category.id).url}
                                            >
                                                <Badge variant="outline" className="hover:bg-accent">
                                                    {category.title}
                                                </Badge>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">Kategori eklenmemiş</p>
                                )}
                            </div>

                            <Separator />

                            <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs flex items-center gap-1.5">
                                    <FlaskConical className="h-3.5 w-3.5" />
                                    İçerikler ({item.ingredients?.length || 0})
                                </Label>
                                {item.ingredients && item.ingredients.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {item.ingredients.map((ingredient) => (
                                            <Link
                                                key={ingredient.id}
                                                href={admin.ingredients.show(ingredient.id).url}
                                            >
                                                <Badge variant="outline" className="hover:bg-accent">
                                                    {ingredient.title}
                                                </Badge>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">İçerik eklenmemiş</p>
                                )}
                            </div>

                            <Separator />

                            <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs">Ürün Açıklaması</Label>
                                <p className="text-sm whitespace-pre-wrap">
                                    {item.description || (
                                        <span className="text-muted-foreground italic">
                                            Açıklama girilmemiş
                                        </span>
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Envanter */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Envanter</CardTitle>
                            <CardDescription>Stok ve envanter bilgileri.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-xs">SKU</Label>
                                    <code className="block rounded bg-muted px-2 py-1 text-sm font-mono">
                                        {item.sku}
                                    </code>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-xs">Barkod</Label>
                                    {item.barcode ? (
                                        <code className="block rounded bg-muted px-2 py-1 text-sm font-mono">
                                            {item.barcode}
                                        </code>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">-</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-xs">Stok Adedi</Label>
                                    <div>
                                        <Badge variant={item.stock > 0 ? 'secondary' : 'destructive'}>
                                            {item.stock > 0 ? `${item.stock} adet` : 'Tükendi'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SEO */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Arama Motoru Optimizasyonu (SEO)</CardTitle>
                            <CardDescription>Arama motorları için meta bilgileri.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs">SEO Başlığı</Label>
                                <p className="text-sm">
                                    {item.seo_title || (
                                        <span className="text-muted-foreground italic">
                                            SEO başlığı girilmemiş
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs">SEO Açıklaması</Label>
                                <p className="text-sm whitespace-pre-wrap">
                                    {item.seo_description || (
                                        <span className="text-muted-foreground italic">
                                            SEO açıklaması girilmemiş
                                        </span>
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tarih Bilgileri */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Tarih Bilgileri
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-xs">Oluşturulma Tarihi</Label>
                                    <p className="text-sm">{formatDate(item.created_at)}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-xs">Son Güncelleme</Label>
                                    <p className="text-sm">{formatDate(item.updated_at)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
