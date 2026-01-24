import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    FlaskConical,
    FolderTree,
    Globe,
    ImageIcon,
    Info,
    Package,
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
import { CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
                    <div className="flex items-center gap-4">
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
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <Tabs defaultValue="general">
                            <CardHeader className="pb-0">
                                <TabsList className="flex-wrap h-auto gap-1">
                                    <TabsTrigger value="general">
                                        <Info className="mr-1.5 h-4 w-4" />
                                        Genel
                                    </TabsTrigger>
                                    <TabsTrigger value="seo">
                                        <Globe className="mr-1.5 h-4 w-4" />
                                        SEO
                                    </TabsTrigger>
                                    <TabsTrigger value="categories">
                                        <FolderTree className="mr-1.5 h-4 w-4" />
                                        Kategoriler ({item.categories?.length || 0})
                                    </TabsTrigger>
                                    <TabsTrigger value="tags">
                                        <Tag className="mr-1.5 h-4 w-4" />
                                        Etiketler ({item.tags?.length || 0})
                                    </TabsTrigger>
                                    <TabsTrigger value="ingredients">
                                        <FlaskConical className="mr-1.5 h-4 w-4" />
                                        İçerikler ({item.ingredients?.length || 0})
                                    </TabsTrigger>
                                    <TabsTrigger value="images">
                                        <ImageIcon className="mr-1.5 h-4 w-4" />
                                        Görseller ({item.images?.length || 0})
                                    </TabsTrigger>
                                </TabsList>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <TabsContent value="general" className="mt-0 space-y-5">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">Ürün Adı</Label>
                                            <p className="text-sm font-medium">{item.title}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">Marka</Label>
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

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">URL Adresi (Slug)</Label>
                                        <p className="text-sm font-medium">
                                            <span className="text-muted-foreground">suug.istanbul/urunler/</span>
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

                                    <Separator />

                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">SKU</Label>
                                            <code className="block rounded bg-muted px-2 py-1 text-sm font-mono">
                                                {item.sku}
                                            </code>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">Barkod</Label>
                                            <p className="text-sm">
                                                {item.barcode ? (
                                                    <code className="rounded bg-muted px-2 py-1 font-mono">
                                                        {item.barcode}
                                                    </code>
                                                ) : (
                                                    <span className="text-muted-foreground italic">-</span>
                                                )}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">Stok</Label>
                                            <Badge variant={item.stock > 0 ? 'secondary' : 'destructive'}>
                                                {item.stock > 0 ? `${item.stock} adet` : 'Tükendi'}
                                            </Badge>
                                        </div>
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

                                <TabsContent value="categories" className="mt-0">
                                    {item.categories && item.categories.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
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
                                        <div className="text-center py-8 text-muted-foreground">
                                            <FolderTree className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">Henüz kategori eklenmemiş.</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="tags" className="mt-0">
                                    {item.tags && item.tags.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {item.tags.map((tag) => (
                                                <Link key={tag.id} href={admin.tags.show(tag.id).url}>
                                                    <Badge variant="secondary" className="hover:bg-secondary/80">
                                                        {tag.title}
                                                    </Badge>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">Henüz etiket eklenmemiş.</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="ingredients" className="mt-0">
                                    {item.ingredients && item.ingredients.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
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
                                        <div className="text-center py-8 text-muted-foreground">
                                            <FlaskConical className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">Henüz içerik eklenmemiş.</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="images" className="mt-0">
                                    {item.images && item.images.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Price Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-primary" />
                                <Label className="font-semibold">Fiyat Bilgisi</Label>
                            </div>
                            <div className="rounded-lg border p-4 space-y-3">
                                <div className="text-center">
                                    {item.sale_price ? (
                                        <>
                                            <p className="text-3xl font-bold text-destructive">
                                                {formatPrice(item.sale_price)}
                                            </p>
                                            <p className="text-lg text-muted-foreground line-through">
                                                {formatPrice(item.price)}
                                            </p>
                                            <Badge variant="destructive" className="mt-2">
                                                %{Math.round(((item.price - item.sale_price) / item.price) * 100)} İndirim
                                            </Badge>
                                        </>
                                    ) : (
                                        <p className="text-3xl font-bold text-primary">
                                            {formatPrice(item.price)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Info className="h-4 w-4 text-primary" />
                                <Label className="font-semibold">Hızlı Bilgi</Label>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Kategoriler:</span>
                                    <span>{item.categories?.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Etiketler:</span>
                                    <span>{item.tags?.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">İçerikler:</span>
                                    <span>{item.ingredients?.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Görseller:</span>
                                    <span>{item.images?.length || 0}</span>
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
