import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import { CardContent, CardHeader } from '@/components/ui/card';
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
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem, Discount, DiscountFormData, DiscountTypeOption } from '@/types';

interface Props {
    item: Discount;
    discountTypes: DiscountTypeOption[];
}

const formatDateTimeLocal = (dateString: string | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
};

export default function DiscountsEdit({ item, discountTypes }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: admin.dashboard().url,
        },
        {
            title: 'İndirimler',
            href: admin.discounts.index().url,
        },
        {
            title: item.title,
            href: admin.discounts.show(item.id).url,
        },
        {
            title: 'Düzenle',
            href: admin.discounts.edit(item.id).url,
        },
    ];

    const { data, setData, put, processing, errors } = useForm<DiscountFormData>({
        title: item.title,
        description: item.description || '',
        type: item.type,
        value: String(item.value),
        code: item.code || '',
        usage_limit: item.usage_limit !== null ? String(item.usage_limit) : '',
        starts_at: formatDateTimeLocal(item.starts_at),
        ends_at: formatDateTimeLocal(item.ends_at),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(admin.discounts.update(item.id).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${item.title} - Düzenle`} />

            <div className="flex w-full flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">İndirimi Düzenle</h1>
                            <p className="text-muted-foreground">
                                {item.title} indiriminin bilgilerini düzenleyin.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href={admin.discounts.show(item.id).url}>Vazgeç</Link>
                        </Button>
                        <LoadingButton onClick={submit} loading={processing}>
                            Kaydet
                        </LoadingButton>
                    </div>
                </div>

                <Separator />

                {/* Form */}
                <form onSubmit={submit} className="max-w-2xl space-y-8">
                    {/* Basic Info */}
                    <div>
                        <CardHeader className="pb-0 px-0">
                            <h2 className="text-lg font-semibold">Temel Bilgiler</h2>
                            <p className="text-sm text-muted-foreground">
                                İndirimin temel bilgilerini güncelleyin.
                            </p>
                        </CardHeader>
                        <CardContent className="pt-6 px-0 space-y-5">
                            <Field>
                                <FieldLabel htmlFor="title">İndirim Başlığı</FieldLabel>
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
                                <FieldLabel htmlFor="description">Açıklama</FieldLabel>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-invalid={!!errors.description}
                                />
                                <FieldError>{errors.description}</FieldError>
                            </Field>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="type">İndirim Tipi</FieldLabel>
                                    <Select
                                        value={data.type}
                                        onValueChange={(value) => setData('type', value as DiscountFormData['type'])}
                                    >
                                        <SelectTrigger id="type" aria-invalid={!!errors.type}>
                                            <SelectValue placeholder="Tip seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {discountTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError>{errors.type}</FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="value">
                                        {data.type === 'percentage' ? 'Yüzde Değeri' : 'Tutar (₺)'}
                                    </FieldLabel>
                                    <Input
                                        id="value"
                                        type="number"
                                        step={data.type === 'percentage' ? '1' : '0.01'}
                                        min="0"
                                        max={data.type === 'percentage' ? '100' : undefined}
                                        value={data.value}
                                        onChange={(e) => setData('value', e.target.value)}
                                        aria-invalid={!!errors.value}
                                    />
                                    <FieldDescription>
                                        {data.type === 'percentage'
                                            ? 'Yüzde olarak indirim oranı (0-100)'
                                            : 'Sabit indirim tutarı'}
                                    </FieldDescription>
                                    <FieldError>{errors.value}</FieldError>
                                </Field>
                            </div>
                        </CardContent>
                    </div>

                    {/* Coupon Code */}
                    <div>
                        <CardHeader className="pb-0 px-0">
                            <h2 className="text-lg font-semibold">Kupon Kodu</h2>
                            <p className="text-sm text-muted-foreground">
                                İsteğe bağlı kupon kodu ve kullanım limiti.
                            </p>
                        </CardHeader>
                        <CardContent className="pt-6 px-0 space-y-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="code">Kupon Kodu</FieldLabel>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        placeholder="YILBASI2024"
                                        aria-invalid={!!errors.code}
                                    />
                                    <FieldDescription>
                                        Müşterilerin kullanacağı benzersiz kod
                                    </FieldDescription>
                                    <FieldError>{errors.code}</FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="usage_limit">Kullanım Limiti</FieldLabel>
                                    <Input
                                        id="usage_limit"
                                        type="number"
                                        min="0"
                                        value={data.usage_limit}
                                        onChange={(e) => setData('usage_limit', e.target.value)}
                                        placeholder="Sınırsız"
                                        aria-invalid={!!errors.usage_limit}
                                    />
                                    <FieldDescription>
                                        Boş bırakırsanız sınırsız kullanılabilir
                                    </FieldDescription>
                                    <FieldError>{errors.usage_limit}</FieldError>
                                </Field>
                            </div>
                        </CardContent>
                    </div>

                    {/* Validity Period */}
                    <div>
                        <CardHeader className="pb-0 px-0">
                            <h2 className="text-lg font-semibold">Geçerlilik Süresi</h2>
                            <p className="text-sm text-muted-foreground">
                                İndirimin geçerli olacağı tarih aralığı.
                            </p>
                        </CardHeader>
                        <CardContent className="pt-6 px-0 space-y-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="starts_at">Başlangıç Tarihi</FieldLabel>
                                    <Input
                                        id="starts_at"
                                        type="datetime-local"
                                        value={data.starts_at}
                                        onChange={(e) => setData('starts_at', e.target.value)}
                                        aria-invalid={!!errors.starts_at}
                                    />
                                    <FieldDescription>
                                        Boş bırakırsanız hemen geçerli olur
                                    </FieldDescription>
                                    <FieldError>{errors.starts_at}</FieldError>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="ends_at">Bitiş Tarihi</FieldLabel>
                                    <Input
                                        id="ends_at"
                                        type="datetime-local"
                                        value={data.ends_at}
                                        onChange={(e) => setData('ends_at', e.target.value)}
                                        aria-invalid={!!errors.ends_at}
                                    />
                                    <FieldDescription>
                                        Boş bırakırsanız süresiz geçerli olur
                                    </FieldDescription>
                                    <FieldError>{errors.ends_at}</FieldError>
                                </Field>
                            </div>
                        </CardContent>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
