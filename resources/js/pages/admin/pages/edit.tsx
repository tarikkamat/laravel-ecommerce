import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEventHandler, useState } from 'react';

import { Button } from '@/components/ui/button';
import { CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loading-button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { WysiwygEditor } from '@/components/ui/wysiwyg';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem, Page, PageFormData, PageTypeOption } from '@/types';

interface Props {
    item: Page;
    pageTypes: PageTypeOption[];
}

export default function PagesEdit({ item, pageTypes }: Props) {
    const { data, setData, put, processing, errors } = useForm<PageFormData>({
        title: item.title,
        slug: item.slug,
        type: item.type,
        content: item.content ?? '',
        contact_email: item.contact_email ?? '',
        contact_phone: item.contact_phone ?? '',
        contact_address: item.contact_address ?? '',
        seo_title: item.seo_title ?? '',
        seo_description: item.seo_description ?? '',
        active: item.active,
    });
    const [slugTouched, setSlugTouched] = useState(false);

    const slugify = (value: string) => {
        const map: Record<string, string> = {
            ç: 'c', Ç: 'c',
            ğ: 'g', Ğ: 'g',
            ı: 'i', I: 'i',
            İ: 'i',
            ö: 'o', Ö: 'o',
            ş: 's', Ş: 's',
            ü: 'u', Ü: 'u',
        };

        return value
            .split('')
            .map((char) => map[char] ?? char)
            .join('')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\\s-]/g, '')
            .replace(/\\s+/g, '-')
            .replace(/-+/g, '-');
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: admin.dashboard.index() },
        { title: 'Sayfalar', href: admin.pages.index().url },
        { title: item.title, href: admin.pages.edit(item.id).url },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(admin.pages.update(item.id).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Sayfa Düzenle - ${item.title}`} />

            <div className="flex w-full flex-col gap-6 p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Sayfa Düzenle</h1>
                        <p className="text-muted-foreground">{item.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href={admin.pages.index().url}>Vazgeç</Link>
                        </Button>
                        <LoadingButton onClick={submit} loading={processing}>
                            Kaydet
                        </LoadingButton>
                    </div>
                </div>

                <Separator />

                <form onSubmit={submit} className="max-w-3xl space-y-8">
                    <div>
                        <CardHeader className="pb-0 px-0">
                            <h2 className="text-lg font-semibold">Temel Bilgiler</h2>
                            <p className="text-sm text-muted-foreground">Sayfanın temel bilgilerini düzenleyin.</p>
                        </CardHeader>
                        <CardContent className="pt-6 px-0 space-y-5">
                            <Field>
                                <FieldLabel htmlFor="title">Başlık</FieldLabel>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setData('title', value);
                                        if (!slugTouched && data.slug === item.slug) {
                                            setData('slug', slugify(value));
                                        }
                                    }}
                                    autoFocus
                                    aria-invalid={!!errors.title}
                                />
                                <FieldError>{errors.title}</FieldError>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => {
                                        setSlugTouched(true);
                                        setData('slug', e.target.value);
                                    }}
                                    aria-invalid={!!errors.slug}
                                />
                                <FieldDescription>Örn: hakkimizda, mesafeli-satis-sozlesmesi</FieldDescription>
                                <FieldError>{errors.slug}</FieldError>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="type">Sayfa Tipi</FieldLabel>
                                <Select value={data.type} onValueChange={(value) => setData('type', value as PageFormData['type'])}>
                                    <SelectTrigger id="type" aria-invalid={!!errors.type}>
                                        <SelectValue placeholder="Tip seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pageTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError>{errors.type}</FieldError>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="content">İçerik</FieldLabel>
                                <WysiwygEditor
                                    value={data.content}
                                    onChange={(value) => setData('content', value)}
                                    placeholder="Sayfa içeriği..."
                                />
                                <FieldDescription>HTML girebilirsiniz.</FieldDescription>
                                <FieldError>{errors.content}</FieldError>
                            </Field>

                            {data.type === 'contact' ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field>
                                        <FieldLabel htmlFor="contact_email">E-posta</FieldLabel>
                                        <Input
                                            id="contact_email"
                                            value={data.contact_email ?? ''}
                                            onChange={(e) => setData('contact_email', e.target.value)}
                                            aria-invalid={!!errors.contact_email}
                                        />
                                        <FieldError>{errors.contact_email}</FieldError>
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="contact_phone">Telefon</FieldLabel>
                                        <Input
                                            id="contact_phone"
                                            value={data.contact_phone ?? ''}
                                            onChange={(e) => setData('contact_phone', e.target.value)}
                                            aria-invalid={!!errors.contact_phone}
                                        />
                                        <FieldError>{errors.contact_phone}</FieldError>
                                    </Field>

                                    <Field className="sm:col-span-2">
                                        <FieldLabel htmlFor="contact_address">Adres</FieldLabel>
                                        <textarea
                                            id="contact_address"
                                            value={data.contact_address ?? ''}
                                            onChange={(e) => setData('contact_address', e.target.value)}
                                            rows={3}
                                            className="flex min-h-[90px] w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            aria-invalid={!!errors.contact_address}
                                        />
                                        <FieldError>{errors.contact_address}</FieldError>
                                    </Field>
                                </div>
                            ) : null}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="seo_title">SEO Başlık</FieldLabel>
                                    <Input
                                        id="seo_title"
                                        value={data.seo_title ?? ''}
                                        onChange={(e) => setData('seo_title', e.target.value)}
                                        aria-invalid={!!errors.seo_title}
                                    />
                                    <FieldError>{errors.seo_title}</FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="seo_description">SEO Açıklama</FieldLabel>
                                    <Input
                                        id="seo_description"
                                        value={data.seo_description ?? ''}
                                        onChange={(e) => setData('seo_description', e.target.value)}
                                        aria-invalid={!!errors.seo_description}
                                    />
                                    <FieldError>{errors.seo_description}</FieldError>
                                </Field>
                            </div>

                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="active"
                                    checked={data.active}
                                    onCheckedChange={(checked) => setData('active', Boolean(checked))}
                                />
                                <FieldLabel htmlFor="active">Yayında</FieldLabel>
                            </div>
                        </CardContent>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
