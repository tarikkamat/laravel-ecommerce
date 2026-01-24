import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Home, Mail, MapPin, Pencil, Shield, Trash2, User as UserIcon } from 'lucide-react';

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
import type { BreadcrumbItem, User } from '@/types';

interface Props {
    item: User;
}

const roleLabels: Record<string, string> = {
    admin: 'Yönetici',
    customer: 'Müşteri',
};

const addressTypeLabels: Record<string, string> = {
    billing: 'Fatura Adresi',
    shipping: 'Teslimat Adresi',
};

export default function UsersShow({ item }: Props) {
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

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
                        <Tabs defaultValue="general">
                            <CardHeader className="pb-0">
                                <TabsList>
                                    <TabsTrigger value="general">
                                        <UserIcon className="mr-1.5 h-4 w-4" />
                                        Genel Bilgiler
                                    </TabsTrigger>
                                    <TabsTrigger value="addresses">
                                        <MapPin className="mr-1.5 h-4 w-4" />
                                        Adresler ({item.addresses?.length || 0})
                                    </TabsTrigger>
                                </TabsList>
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
