import { Head, Link, useForm } from '@inertiajs/react';
import { Globe, Info, Lock, Unlock } from 'lucide-react';
import { type FormEventHandler, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { CardContent, CardHeader } from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loading-button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem, TagFormData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: admin.dashboard.index(),
    },
    {
        title: 'Etiketler',
        href: admin.tags.index().url,
    },
    {
        title: 'Yeni Etiket',
        href: admin.tags.create().url,
    },
];

export default function TagsCreate() {
    const [isSlugLocked, setIsSlugLocked] = useState(true);

    const { data, setData, post, processing, errors } = useForm<TagFormData>({
        title: '',
        slug: '',
        description: '',
        seo_title: '',
        seo_description: '',
    });

    const generateSlug = (text: string): string => {
        return text
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    useEffect(() => {
        if (isSlugLocked && data.title) {
            setData('slug', generateSlug(data.title));
        }
    }, [data.title, isSlugLocked]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(admin.tags.store().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Yeni Etiket Oluştur" />

            <div className="flex w-full flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Yeni Etiket Oluştur</h1>
                            <p className="text-muted-foreground">
                                Ürünlerinizi etiketlemek için yeni bir etiket tanımlayın.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href={admin.tags.index().url}>Vazgeç</Link>
                        </Button>
                        <LoadingButton onClick={submit} loading={processing}>
                            Kaydet
                        </LoadingButton>
                    </div>
                </div>

                <Separator />

                {/* Form */}
                <form onSubmit={submit} className="max-w-2xl">
                    <Tabs defaultValue="general">
                        <CardHeader className="pb-0 px-0">
                            <TabsList>
                                <TabsTrigger value="general">
                                    <Info className="mr-1.5 h-4 w-4" />
                                    Genel Bilgiler
                                </TabsTrigger>
                                <TabsTrigger value="seo">
                                    <Globe className="mr-1.5 h-4 w-4" />
                                    SEO
                                </TabsTrigger>
                            </TabsList>
                        </CardHeader>
                        <CardContent className="pt-6 px-0">
                            <TabsContent value="general" className="mt-0 space-y-5">
                                <Field>
                                    <FieldLabel htmlFor="title">Etiket Adı</FieldLabel>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        autoFocus
                                        aria-invalid={!!errors.title}
                                    />
                                    <FieldError>{errors.title}</FieldError>
                                </Field>

                                <Field>
                                    <div className="flex items-center justify-between">
                                        <FieldLabel htmlFor="slug">URL Adresi (Slug)</FieldLabel>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2 text-xs text-muted-foreground"
                                            onClick={() => setIsSlugLocked(!isSlugLocked)}
                                        >
                                            {isSlugLocked ? (
                                                <>
                                                    <Lock className="mr-1 h-3 w-3" /> Kilidi Kaldır
                                                </>
                                            ) : (
                                                <>
                                                    <Unlock className="mr-1 h-3 w-3" /> Kilitle
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                            <span className="text-sm text-muted-foreground">
                                                suug.istanbul/etiketler/
                                            </span>
                                        </div>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                            disabled={isSlugLocked}
                                            className="pl-40"
                                            aria-invalid={!!errors.slug}
                                        />
                                    </div>
                                    <FieldDescription>
                                        Bu etiketin web sitesindeki benzersiz adresidir.
                                    </FieldDescription>
                                    <FieldError>{errors.slug}</FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="description">Açıklama</FieldLabel>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={5}
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        aria-invalid={!!errors.description}
                                    />
                                    <FieldError>{errors.description}</FieldError>
                                </Field>
                            </TabsContent>

                            <TabsContent value="seo" className="mt-0 space-y-5">
                                <Field>
                                    <div className="flex items-center justify-between">
                                        <FieldLabel htmlFor="seo_title">SEO Başlığı</FieldLabel>
                                        <span
                                            className={`text-[10px] ${
                                                (data.seo_title || '').length > 60
                                                    ? 'text-destructive'
                                                    : 'text-muted-foreground'
                                            }`}
                                        >
                                            {(data.seo_title || '').length} / 60
                                        </span>
                                    </div>
                                    <Input
                                        id="seo_title"
                                        value={data.seo_title || ''}
                                        onChange={(e) => setData('seo_title', e.target.value)}
                                        aria-invalid={!!errors.seo_title}
                                    />
                                    <FieldError>{errors.seo_title}</FieldError>
                                </Field>

                                <Field>
                                    <div className="flex items-center justify-between">
                                        <FieldLabel htmlFor="seo_description">SEO Açıklaması</FieldLabel>
                                        <span
                                            className={`text-[10px] ${
                                                (data.seo_description || '').length > 160
                                                    ? 'text-destructive'
                                                    : 'text-muted-foreground'
                                            }`}
                                        >
                                            {(data.seo_description || '').length} / 160
                                        </span>
                                    </div>
                                    <textarea
                                        id="seo_description"
                                        value={data.seo_description || ''}
                                        onChange={(e) => setData('seo_description', e.target.value)}
                                        rows={3}
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        aria-invalid={!!errors.seo_description}
                                    />
                                    <FieldError>{errors.seo_description}</FieldError>
                                </Field>
                            </TabsContent>
                        </CardContent>
                    </Tabs>
                </form>
            </div>
        </AppLayout>
    );
}
