import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { ImagePickerModal } from '@/components/admin/image-picker-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loading-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: admin.dashboard.index().url,
    },
    {
        title: 'Ayarlar',
        href: admin.settings.edit().url,
    },
];

type CategoryOption = {
    id: number;
    title: string;
};

type SettingsPayload = {
    site: {
        site_title: string;
        meta_description: string;
        meta_keywords: string;
        header_logo_path: string;
        header_logo_text: string;
        header_logo_tagline: string;
        footer_logo_path: string;
        footer_logo_text: string;
        footer_description: string;
        footer_copyright: string;
        seller_name: string;
        seller_address: string;
        seller_phone: string;
        seller_email: string;
        whatsapp_enabled: boolean;
        whatsapp_phone: string;
        whatsapp_message: string;
        announcement_enabled: boolean;
        announcement_text: string;
        announcement_speed_seconds: number;
        announcement_background: string;
        announcement_text_color: string;
        footer_bottom_links: { label: string; url: string }[];
        footer_socials: { label: string; url: string }[];
        footer_menus: { title: string; items: { label: string; url: string }[] }[];
    };
    navigation: {
        header_menu: { label: string; url: string }[];
        show_home_link: boolean;
        show_brands_menu: boolean;
        show_categories_menu: boolean;
    };
    tax: {
        default_rate: number;
        label: string;
        category_rates: { category_id: number; rate: number }[];
    };
    payments: {
        iyzico_enabled: boolean;
        iyzico_api_key: string;
        iyzico_secret_key: string;
        iyzico_base_url: string;
        iyzico_callback_url: string;
        iyzico_webhook_secret: string;
    };
    shipping: {
        free_shipping_enabled: boolean;
        free_shipping_minimum: number;
        geliver_enabled: boolean;
        geliver_token: string;
        geliver_sender_address_id: string;
        geliver_source_identifier: string;
        geliver_webhook_verify: boolean;
        geliver_webhook_secret: string;
        geliver_default_city_code: string;
        geliver_distance_unit: string;
        geliver_mass_unit: string;
        geliver_default_length: number;
        geliver_default_width: number;
        geliver_default_height: number;
        geliver_default_weight: number;
    };
    home: {
        brands_sort_by: string;
        brands_sort_direction: string;
        product_grid_sort_by: string;
        product_grid_sort_direction: string;
        hero_autoplay_ms: number;
        hero_slides: {
            image_path: string;
            eyebrow?: string;
            title?: string;
            subtitle?: string;
            buttons?: { label: string; url: string; variant?: 'primary' | 'secondary' }[];
        }[];
    };
    catalog: {
        products_per_page: number;
        brands_per_page: number;
        categories_per_page: number;
        tags_per_page: number;
        ingredients_per_page: number;
    };
};

type SettingsFormData = {
    site_title: string;
    meta_description: string;
    meta_keywords: string;
    header_logo_path: string;
    header_logo_text: string;
    header_logo_tagline: string;
    footer_logo_path: string;
    footer_logo_text: string;
    footer_description: string;
    footer_copyright: string;
    seller_name: string;
    seller_address: string;
    seller_phone: string;
    seller_email: string;
    whatsapp_enabled: boolean;
    whatsapp_phone: string;
    whatsapp_message: string;
    announcement_enabled: boolean;
    announcement_text: string;
    announcement_speed_seconds: number;
    announcement_background: string;
    announcement_text_color: string;
    footer_bottom_links: { label: string; url: string }[];
    footer_socials: { label: string; url: string }[];
    footer_menus: { title: string; items: { label: string; url: string }[] }[];
    header_menu: { label: string; url: string }[];
    show_home_link: boolean;
    show_brands_menu: boolean;
    show_categories_menu: boolean;
    tax_default_rate: number;
    tax_label: string;
    tax_category_rates: { category_id: number; rate: number }[];
    iyzico_enabled: boolean;
    iyzico_api_key: string;
    iyzico_secret_key: string;
    iyzico_base_url: string;
    iyzico_callback_url: string;
    iyzico_webhook_secret: string;
    free_shipping_enabled: boolean;
    free_shipping_minimum: number;
    geliver_enabled: boolean;
    geliver_token: string;
    geliver_sender_address_id: string;
    geliver_source_identifier: string;
    geliver_webhook_verify: boolean;
    geliver_webhook_secret: string;
    geliver_default_city_code: string;
    geliver_distance_unit: string;
    geliver_mass_unit: string;
    geliver_default_length: number;
    geliver_default_width: number;
    geliver_default_height: number;
    geliver_default_weight: number;
    home_brands_sort_by: string;
    home_brands_sort_direction: string;
    home_product_grid_sort_by: string;
    home_product_grid_sort_direction: string;
    home_hero_autoplay_ms: number;
    home_hero_slides: {
        image_path: string;
        eyebrow: string;
        title: string;
        subtitle: string;
        buttons: { label: string; url: string; variant?: 'primary' | 'secondary' }[];
    }[];
    products_per_page: number;
    brands_per_page: number;
    categories_per_page: number;
    tags_per_page: number;
    ingredients_per_page: number;
};

type Props = {
    settings: SettingsPayload;
    categories: CategoryOption[];
};

const toStoragePath = (value: string) => {
    if (!value) return '';
    if (value.startsWith('http')) return value;
    return value.startsWith('/storage/') ? value.replace('/storage/', '') : value;
};

const toStorageUrl = (value: string) => {
    if (!value) return '';
    if (value.startsWith('http')) return value;
    return value.startsWith('/storage/') ? value : `/storage/${value}`;
};

export default function SettingsIndex({ settings, categories }: Props) {
    const [imagePickerTarget, setImagePickerTarget] = useState<
        | { type: 'header' | 'footer' }
        | { type: 'hero'; slideIndex: number }
        | null
    >(null);

    const { data, setData, put, processing, errors, recentlySuccessful } = useForm<SettingsFormData>({
        site_title: settings.site.site_title ?? '',
        meta_description: settings.site.meta_description ?? '',
        meta_keywords: settings.site.meta_keywords ?? '',
        header_logo_path: settings.site.header_logo_path ?? '',
        header_logo_text: settings.site.header_logo_text ?? '',
        header_logo_tagline: settings.site.header_logo_tagline ?? '',
        footer_logo_path: settings.site.footer_logo_path ?? '',
        footer_logo_text: settings.site.footer_logo_text ?? '',
        footer_description: settings.site.footer_description ?? '',
        footer_copyright: settings.site.footer_copyright ?? '',
        seller_name: settings.site.seller_name ?? '',
        seller_address: settings.site.seller_address ?? '',
        seller_phone: settings.site.seller_phone ?? '',
        seller_email: settings.site.seller_email ?? '',
        whatsapp_enabled: settings.site.whatsapp_enabled ?? false,
        whatsapp_phone: settings.site.whatsapp_phone ?? '',
        whatsapp_message: settings.site.whatsapp_message ?? '',
        announcement_enabled: settings.site.announcement_enabled ?? false,
        announcement_text: settings.site.announcement_text ?? '',
        announcement_speed_seconds: settings.site.announcement_speed_seconds ?? 18,
        announcement_background: settings.site.announcement_background ?? '#181113',
        announcement_text_color: settings.site.announcement_text_color ?? '#ffffff',
        footer_bottom_links: settings.site.footer_bottom_links ?? [],
        footer_socials: settings.site.footer_socials ?? [],
        footer_menus: settings.site.footer_menus ?? [],
        header_menu: settings.navigation.header_menu ?? [],
        show_home_link: settings.navigation.show_home_link ?? true,
        show_brands_menu: settings.navigation.show_brands_menu ?? true,
        show_categories_menu: settings.navigation.show_categories_menu ?? true,
        tax_default_rate: settings.tax.default_rate ?? 0,
        tax_label: settings.tax.label ?? 'KDV',
        tax_category_rates: settings.tax.category_rates ?? [],
        iyzico_enabled: settings.payments.iyzico_enabled ?? true,
        iyzico_api_key: settings.payments.iyzico_api_key ?? '',
        iyzico_secret_key: settings.payments.iyzico_secret_key ?? '',
        iyzico_base_url: settings.payments.iyzico_base_url ?? '',
        iyzico_callback_url: settings.payments.iyzico_callback_url ?? '',
        iyzico_webhook_secret: settings.payments.iyzico_webhook_secret ?? '',
        free_shipping_enabled: settings.shipping.free_shipping_enabled ?? false,
        free_shipping_minimum: settings.shipping.free_shipping_minimum ?? 0,
        geliver_enabled: settings.shipping.geliver_enabled ?? true,
        geliver_token: settings.shipping.geliver_token ?? '',
        geliver_sender_address_id: settings.shipping.geliver_sender_address_id ?? '',
        geliver_source_identifier: settings.shipping.geliver_source_identifier ?? '',
        geliver_webhook_verify: settings.shipping.geliver_webhook_verify ?? false,
        geliver_webhook_secret: settings.shipping.geliver_webhook_secret ?? '',
        geliver_default_city_code: settings.shipping.geliver_default_city_code ?? '',
        geliver_distance_unit: settings.shipping.geliver_distance_unit ?? '',
        geliver_mass_unit: settings.shipping.geliver_mass_unit ?? '',
        geliver_default_length: settings.shipping.geliver_default_length ?? 0,
        geliver_default_width: settings.shipping.geliver_default_width ?? 0,
        geliver_default_height: settings.shipping.geliver_default_height ?? 0,
        geliver_default_weight: settings.shipping.geliver_default_weight ?? 0,
        home_brands_sort_by: settings.home.brands_sort_by ?? 'title',
        home_brands_sort_direction: settings.home.brands_sort_direction ?? 'asc',
        home_product_grid_sort_by: settings.home.product_grid_sort_by ?? 'title',
        home_product_grid_sort_direction: settings.home.product_grid_sort_direction ?? 'asc',
        home_hero_autoplay_ms: settings.home.hero_autoplay_ms ?? 6000,
        home_hero_slides: (settings.home.hero_slides ?? []).map((slide) => ({
            image_path: slide.image_path ?? '',
            eyebrow: slide.eyebrow ?? '',
            title: slide.title ?? '',
            subtitle: slide.subtitle ?? '',
            buttons: (slide.buttons ?? []).map((button) => ({
                label: button.label ?? '',
                url: button.url ?? '',
                variant: button.variant ?? 'primary',
            })),
        })),
        products_per_page: settings.catalog.products_per_page ?? 15,
        brands_per_page: settings.catalog.brands_per_page ?? 15,
        categories_per_page: settings.catalog.categories_per_page ?? 15,
        tags_per_page: settings.catalog.tags_per_page ?? 15,
        ingredients_per_page: settings.catalog.ingredients_per_page ?? 15,
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(admin.settings.update().url, {
            preserveScroll: true,
        });
    };

    const headerLogoUrl = useMemo(() => toStorageUrl(data.header_logo_path), [data.header_logo_path]);
    const footerLogoUrl = useMemo(() => toStorageUrl(data.footer_logo_path), [data.footer_logo_path]);

    const openLogoPicker = (target: 'header' | 'footer') => {
        setImagePickerTarget({ type: target });
    };

    const handleLogoSelect = (imageUrl: string) => {
        const path = toStoragePath(imageUrl);
        if (imagePickerTarget?.type === 'header') {
            setData('header_logo_path', path);
        }
        if (imagePickerTarget?.type === 'footer') {
            setData('footer_logo_path', path);
        }
        if (imagePickerTarget?.type === 'hero' && typeof imagePickerTarget.slideIndex === 'number') {
            const nextSlides = [...data.home_hero_slides];
            const current = nextSlides[imagePickerTarget.slideIndex];
            if (current) {
                nextSlides[imagePickerTarget.slideIndex] = { ...current, image_path: path };
                setData('home_hero_slides', nextSlides);
            }
        }
        setImagePickerTarget(null);
    };

    const addHeroSlide = () => {
        setData('home_hero_slides', [
            ...data.home_hero_slides,
            {
                image_path: '',
                eyebrow: '',
                title: '',
                subtitle: '',
                buttons: [
                    { label: '', url: '', variant: 'primary' },
                ],
            },
        ]);
    };

    const removeHeroSlide = (index: number) => {
        setData('home_hero_slides', data.home_hero_slides.filter((_, i) => i !== index));
    };

    const updateHeroSlide = (index: number, key: 'image_path' | 'eyebrow' | 'title' | 'subtitle', value: string) => {
        const next = [...data.home_hero_slides];
        next[index] = { ...next[index], [key]: value };
        setData('home_hero_slides', next);
    };

    const addHeroButton = (slideIndex: number) => {
        const next = [...data.home_hero_slides];
        const slide = next[slideIndex];
        if (!slide) return;
        slide.buttons = [...(slide.buttons ?? []), { label: '', url: '', variant: 'primary' }];
        next[slideIndex] = { ...slide };
        setData('home_hero_slides', next);
    };

    const removeHeroButton = (slideIndex: number, buttonIndex: number) => {
        const next = [...data.home_hero_slides];
        const slide = next[slideIndex];
        if (!slide) return;
        slide.buttons = (slide.buttons ?? []).filter((_, i) => i !== buttonIndex);
        next[slideIndex] = { ...slide };
        setData('home_hero_slides', next);
    };

    const updateHeroButton = (
        slideIndex: number,
        buttonIndex: number,
        key: 'label' | 'url' | 'variant',
        value: string,
    ) => {
        const next = [...data.home_hero_slides];
        const slide = next[slideIndex];
        if (!slide) return;
        const buttons = [...(slide.buttons ?? [])];
        buttons[buttonIndex] = { ...buttons[buttonIndex], [key]: value };
        next[slideIndex] = { ...slide, buttons };
        setData('home_hero_slides', next);
    };

    const updateHeaderMenuItem = (index: number, key: 'label' | 'url', value: string) => {
        const next = [...data.header_menu];
        next[index] = { ...next[index], [key]: value };
        setData('header_menu', next);
    };

    const addHeaderMenuItem = () => {
        setData('header_menu', [...data.header_menu, { label: '', url: '' }]);
    };

    const removeHeaderMenuItem = (index: number) => {
        setData('header_menu', data.header_menu.filter((_, i) => i !== index));
    };

    const addFooterBottomLink = () => {
        setData('footer_bottom_links', [...data.footer_bottom_links, { label: '', url: '' }]);
    };

    const updateFooterBottomLink = (index: number, key: 'label' | 'url', value: string) => {
        const next = [...data.footer_bottom_links];
        next[index] = { ...next[index], [key]: value };
        setData('footer_bottom_links', next);
    };

    const removeFooterBottomLink = (index: number) => {
        setData('footer_bottom_links', data.footer_bottom_links.filter((_, i) => i !== index));
    };

    const addFooterSocial = () => {
        setData('footer_socials', [...data.footer_socials, { label: '', url: '' }]);
    };

    const updateFooterSocial = (index: number, key: 'label' | 'url', value: string) => {
        const next = [...data.footer_socials];
        next[index] = { ...next[index], [key]: value };
        setData('footer_socials', next);
    };

    const removeFooterSocial = (index: number) => {
        setData('footer_socials', data.footer_socials.filter((_, i) => i !== index));
    };

    const addFooterMenu = () => {
        setData('footer_menus', [...data.footer_menus, { title: '', items: [] }]);
    };

    const updateFooterMenuTitle = (index: number, value: string) => {
        const next = [...data.footer_menus];
        next[index] = { ...next[index], title: value };
        setData('footer_menus', next);
    };

    const removeFooterMenu = (index: number) => {
        setData('footer_menus', data.footer_menus.filter((_, i) => i !== index));
    };

    const addFooterMenuItem = (menuIndex: number) => {
        const next = [...data.footer_menus];
        const menu = next[menuIndex];
        menu.items = [...menu.items, { label: '', url: '' }];
        next[menuIndex] = { ...menu };
        setData('footer_menus', next);
    };

    const updateFooterMenuItem = (menuIndex: number, itemIndex: number, key: 'label' | 'url', value: string) => {
        const next = [...data.footer_menus];
        const menu = next[menuIndex];
        const items = [...menu.items];
        items[itemIndex] = { ...items[itemIndex], [key]: value };
        menu.items = items;
        next[menuIndex] = { ...menu };
        setData('footer_menus', next);
    };

    const removeFooterMenuItem = (menuIndex: number, itemIndex: number) => {
        const next = [...data.footer_menus];
        const menu = next[menuIndex];
        menu.items = menu.items.filter((_, idx) => idx !== itemIndex);
        next[menuIndex] = { ...menu };
        setData('footer_menus', next);
    };

    const getCategoryRate = (categoryId: number) => {
        return data.tax_category_rates.find((item) => item.category_id === categoryId)?.rate ?? '';
    };

    const updateCategoryRate = (categoryId: number, rawValue: string) => {
        const value = rawValue === '' ? null : Number(rawValue);
        const next = [...data.tax_category_rates];
        const index = next.findIndex((item) => item.category_id === categoryId);

        if (value === null || Number.isNaN(value)) {
            if (index >= 0) {
                next.splice(index, 1);
                setData('tax_category_rates', next);
            }
            return;
        }

        if (index >= 0) {
            next[index] = { category_id: categoryId, rate: value };
        } else {
            next.push({ category_id: categoryId, rate: value });
        }

        setData('tax_category_rates', next);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ayarlar" />

            <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Ayarlar</h1>
                        <p className="text-muted-foreground">
                            Site genelinde kullanılan ayarları buradan düzenleyebilirsiniz.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {recentlySuccessful && (
                            <span className="text-sm text-emerald-600">Kaydedildi</span>
                        )}
                        <LoadingButton type="submit" loading={processing}>
                            Kaydet
                        </LoadingButton>
                    </div>
                </div>

                <Tabs defaultValue="general" className="flex-1">
                    <TabsList className="flex flex-wrap justify-start">
                        <TabsTrigger value="general">Genel</TabsTrigger>
                        <TabsTrigger value="navigation">Navigasyon</TabsTrigger>
                        <TabsTrigger value="home">Anasayfa</TabsTrigger>
                        <TabsTrigger value="catalog">Katalog</TabsTrigger>
                        <TabsTrigger value="payments">Ödeme</TabsTrigger>
                        <TabsTrigger value="shipping">Kargo</TabsTrigger>
                        <TabsTrigger value="contact">İletişim</TabsTrigger>
                        <TabsTrigger value="tax">Vergi</TabsTrigger>
                    </TabsList>

                    <TabsContent value="navigation" className="mt-6 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Header Menü</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={data.show_home_link}
                                            onChange={(event) => setData('show_home_link', event.target.checked)}
                                        />
                                        Anasayfa bağlantısı
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={data.show_brands_menu}
                                            onChange={(event) => setData('show_brands_menu', event.target.checked)}
                                        />
                                        Markalar menüsü
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={data.show_categories_menu}
                                            onChange={(event) => setData('show_categories_menu', event.target.checked)}
                                        />
                                        Kategori menüleri
                                    </label>
                                </div>

                                {data.header_menu.length === 0 && (
                                    <p className="text-sm text-muted-foreground">Ek menü öğesi eklenmedi.</p>
                                )}

                                <div className="space-y-3">
                                    {data.header_menu.map((item, index) => (
                                        <div key={`header-menu-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                                            <Input
                                                value={item.label}
                                                onChange={(event) => updateHeaderMenuItem(index, 'label', event.target.value)}
                                                placeholder="Menü etiketi"
                                            />
                                            <Input
                                                value={item.url}
                                                onChange={(event) => updateHeaderMenuItem(index, 'url', event.target.value)}
                                                placeholder="/hakkimizda"
                                            />
                                            <Button type="button" variant="outline" onClick={() => removeHeaderMenuItem(index)}>
                                                Kaldır
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <Button type="button" variant="secondary" onClick={addHeaderMenuItem}>
                                    Menü Ekle
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="general" className="mt-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Site Genel</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="site_title">Site Başlığı</FieldLabel>
                                <Input
                                    id="site_title"
                                    value={data.site_title}
                                    onChange={(event) => setData('site_title', event.target.value)}
                                    aria-invalid={!!errors.site_title}
                                />
                                <FieldError>{errors.site_title}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="meta_description">Meta Açıklaması</FieldLabel>
                                <Input
                                    id="meta_description"
                                    value={data.meta_description}
                                    onChange={(event) => setData('meta_description', event.target.value)}
                                    aria-invalid={!!errors.meta_description}
                                />
                                <FieldError>{errors.meta_description}</FieldError>
                            </Field>
                            <Field className="md:col-span-2">
                                <FieldLabel htmlFor="meta_keywords">Meta Anahtar Kelimeler</FieldLabel>
                                <Input
                                    id="meta_keywords"
                                    value={data.meta_keywords}
                                    onChange={(event) => setData('meta_keywords', event.target.value)}
                                    aria-invalid={!!errors.meta_keywords}
                                />
                                <FieldDescription>Virgülle ayırabilirsiniz.</FieldDescription>
                                <FieldError>{errors.meta_keywords}</FieldError>
                            </Field>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Header</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel>Header Logo</FieldLabel>
                                <div className="flex items-center gap-3">
                                    {headerLogoUrl ? (
                                        <img
                                            src={headerLogoUrl}
                                            alt="Header Logo"
                                            className="h-12 w-12 rounded-lg border object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border text-xs text-muted-foreground">
                                            Logo yok
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        <Button type="button" variant="outline" onClick={() => openLogoPicker('header')}>
                                            Görsel Seç
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setData('header_logo_path', '')}
                                        >
                                            Temizle
                                        </Button>
                                    </div>
                                </div>
                                <FieldError>{errors.header_logo_path}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="header_logo_text">Logo Metni</FieldLabel>
                                <Input
                                    id="header_logo_text"
                                    value={data.header_logo_text}
                                    onChange={(event) => setData('header_logo_text', event.target.value)}
                                    aria-invalid={!!errors.header_logo_text}
                                />
                                <FieldError>{errors.header_logo_text}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="header_logo_tagline">Logo Alt Metni</FieldLabel>
                                <Input
                                    id="header_logo_tagline"
                                    value={data.header_logo_tagline}
                                    onChange={(event) => setData('header_logo_tagline', event.target.value)}
                                    aria-invalid={!!errors.header_logo_tagline}
                                />
                                <FieldError>{errors.header_logo_tagline}</FieldError>
                            </Field>
                        </div>

                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Footer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel>Footer Logo</FieldLabel>
                                <div className="flex items-center gap-3">
                                    {footerLogoUrl ? (
                                        <img
                                            src={footerLogoUrl}
                                            alt="Footer Logo"
                                            className="h-12 w-12 rounded-lg border object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border text-xs text-muted-foreground">
                                            Logo yok
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        <Button type="button" variant="outline" onClick={() => openLogoPicker('footer')}>
                                            Görsel Seç
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setData('footer_logo_path', '')}
                                        >
                                            Temizle
                                        </Button>
                                    </div>
                                </div>
                                <FieldError>{errors.footer_logo_path}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="footer_logo_text">Footer Logo Metni</FieldLabel>
                                <Input
                                    id="footer_logo_text"
                                    value={data.footer_logo_text}
                                    onChange={(event) => setData('footer_logo_text', event.target.value)}
                                    aria-invalid={!!errors.footer_logo_text}
                                />
                                <FieldError>{errors.footer_logo_text}</FieldError>
                            </Field>
                            <Field className="md:col-span-2">
                                <FieldLabel htmlFor="footer_description">Footer Açıklaması</FieldLabel>
                                <textarea
                                    id="footer_description"
                                    value={data.footer_description}
                                    onChange={(event) => setData('footer_description', event.target.value)}
                                    rows={3}
                                    className="flex min-h-[90px] w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <FieldError>{errors.footer_description}</FieldError>
                            </Field>
                            <Field className="md:col-span-2">
                                <FieldLabel htmlFor="footer_copyright">Footer Copyright</FieldLabel>
                                <Input
                                    id="footer_copyright"
                                    value={data.footer_copyright}
                                    onChange={(event) => setData('footer_copyright', event.target.value)}
                                />
                                <FieldError>{errors.footer_copyright}</FieldError>
                            </Field>
                        </div>

                        <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold">Satici Bilgileri</h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <Field>
                                    <FieldLabel htmlFor="seller_name">Unvan / Ad Soyad</FieldLabel>
                                    <Input
                                        id="seller_name"
                                        value={data.seller_name}
                                        onChange={(event) => setData('seller_name', event.target.value)}
                                    />
                                    <FieldError>{errors.seller_name}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="seller_phone">Telefon</FieldLabel>
                                    <Input
                                        id="seller_phone"
                                        value={data.seller_phone}
                                        onChange={(event) => setData('seller_phone', event.target.value)}
                                    />
                                    <FieldError>{errors.seller_phone}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="seller_email">E-posta</FieldLabel>
                                    <Input
                                        id="seller_email"
                                        value={data.seller_email}
                                        onChange={(event) => setData('seller_email', event.target.value)}
                                    />
                                        <FieldError>{errors.seller_email}</FieldError>
                                    </Field>
                            <Field className="md:col-span-2">
                                <FieldLabel htmlFor="seller_address">Adres</FieldLabel>
                                <textarea
                                    id="seller_address"
                                    value={data.seller_address}
                                    onChange={(event) => setData('seller_address', event.target.value)}
                                    rows={3}
                                    className="flex min-h-[90px] w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <FieldError>{errors.seller_address}</FieldError>
                            </Field>
                            <div className="md:col-span-2 rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                                Sözleşme şablonunda bu alanları kullanmak için şu yer tutucuları ekleyebilirsiniz:
                                {' '}
                                <span className="font-medium">{'{{SELLER_NAME}}'}</span>,
                                {' '}
                                <span className="font-medium">{'{{SELLER_ADDRESS}}'}</span>,
                                {' '}
                                <span className="font-medium">{'{{SELLER_PHONE}}'}</span>,
                                {' '}
                                <span className="font-medium">{'{{SELLER_EMAIL}}'}</span>,
                                {' '}
                                <span className="font-medium">{'{{BUYER_NAME}}'}</span>,
                                {' '}
                                <span className="font-medium">{'{{BUYER_ADDRESS}}'}</span>,
                                {' '}
                                <span className="font-medium">{'{{BUYER_PHONE}}'}</span>,
                                {' '}
                                <span className="font-medium">{'{{ORDER_SUMMARY}}'}</span>,{' '}
                                <span className="font-medium">{'{{BUYER_EMAIL}}'}</span>.
                            </div>
                        </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold">Sosyal Medya</h3>
                            {data.footer_socials.length === 0 && (
                                <p className="text-sm text-muted-foreground">Sosyal medya hesabı eklenmedi.</p>
                            )}
                            {data.footer_socials.map((item, index) => (
                                <div key={`footer-social-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                                    <Input
                                        value={item.label}
                                        onChange={(event) => updateFooterSocial(index, 'label', event.target.value)}
                                        placeholder="Instagram"
                                    />
                                    <Input
                                        value={item.url}
                                        onChange={(event) => updateFooterSocial(index, 'url', event.target.value)}
                                        placeholder="https://instagram.com/..."
                                    />
                                    <Button type="button" variant="outline" onClick={() => removeFooterSocial(index)}>
                                        Kaldır
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="secondary" onClick={addFooterSocial}>
                                Sosyal Medya Ekle
                            </Button>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold">Footer Menüleri</h3>
                            {data.footer_menus.length === 0 && (
                                <p className="text-sm text-muted-foreground">Footer menüsü eklenmedi.</p>
                            )}
                            <div className="space-y-4">
                                {data.footer_menus.map((menu, menuIndex) => (
                                    <div key={`footer-menu-${menuIndex}`} className="rounded-lg border p-4">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <Input
                                                value={menu.title}
                                                onChange={(event) => updateFooterMenuTitle(menuIndex, event.target.value)}
                                                placeholder="Menü Başlığı"
                                            />
                                            <Button type="button" variant="outline" onClick={() => removeFooterMenu(menuIndex)}>
                                                Menüyü Sil
                                            </Button>
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            {menu.items.length === 0 && (
                                                <p className="text-sm text-muted-foreground">Menü öğesi eklenmedi.</p>
                                            )}
                                            {menu.items.map((item, itemIndex) => (
                                                <div key={`footer-menu-${menuIndex}-item-${itemIndex}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                                                    <Input
                                                        value={item.label}
                                                        onChange={(event) =>
                                                            updateFooterMenuItem(menuIndex, itemIndex, 'label', event.target.value)
                                                        }
                                                        placeholder="Hakkımızda"
                                                    />
                                                    <Input
                                                        value={item.url}
                                                        onChange={(event) =>
                                                            updateFooterMenuItem(menuIndex, itemIndex, 'url', event.target.value)
                                                        }
                                                        placeholder="/sayfa/hakkimizda"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => removeFooterMenuItem(menuIndex, itemIndex)}
                                                    >
                                                        Kaldır
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button type="button" variant="secondary" onClick={() => addFooterMenuItem(menuIndex)}>
                                                Menü Öğesi Ekle
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button type="button" variant="secondary" onClick={addFooterMenu}>
                                Footer Menüsü Ekle
                            </Button>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold">Footer Alt Linkleri</h3>
                            {data.footer_bottom_links.length === 0 && (
                                <p className="text-sm text-muted-foreground">Alt link eklenmedi.</p>
                            )}
                            {data.footer_bottom_links.map((item, index) => (
                                <div key={`footer-bottom-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                                    <Input
                                        value={item.label}
                                        onChange={(event) => updateFooterBottomLink(index, 'label', event.target.value)}
                                        placeholder="Gizlilik"
                                    />
                                    <Input
                                        value={item.url}
                                        onChange={(event) => updateFooterBottomLink(index, 'url', event.target.value)}
                                        placeholder="/sayfa/gizlilik"
                                    />
                                    <Button type="button" variant="outline" onClick={() => removeFooterBottomLink(index)}>
                                        Kaldır
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="secondary" onClick={addFooterBottomLink}>
                                Alt Link Ekle
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                    </TabsContent>

                    <TabsContent value="tax" className="mt-6 space-y-6">

                <Card>
                    <CardHeader>
                        <CardTitle>Vergi Ayarları</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="tax_default_rate">Varsayılan Vergi Oranı</FieldLabel>
                                <Input
                                    id="tax_default_rate"
                                    type="number"
                                    step="0.01"
                                    value={data.tax_default_rate}
                                    onChange={(event) => setData('tax_default_rate', Number(event.target.value))}
                                />
                                <FieldDescription>Örn: 0.20 = %20 KDV</FieldDescription>
                                <FieldError>{errors.tax_default_rate}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="tax_label">Vergi Etiketi</FieldLabel>
                                <Input
                                    id="tax_label"
                                    value={data.tax_label}
                                    onChange={(event) => setData('tax_label', event.target.value)}
                                />
                                <FieldError>{errors.tax_label}</FieldError>
                            </Field>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold">Kategori Bazlı Vergi</h3>
                            <div className="grid gap-3 md:grid-cols-2">
                                {categories.map((category) => (
                                    <div key={category.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                                        <div>
                                            <div className="text-sm font-medium">{category.title}</div>
                                            <div className="text-xs text-muted-foreground">Kategori ID: {category.id}</div>
                                        </div>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            className="w-28"
                                            value={getCategoryRate(category.id)}
                                            onChange={(event) => updateCategoryRate(category.id, event.target.value)}
                                            placeholder="0.20"
                                        />
                                    </div>
                                ))}
                            </div>
                            <FieldDescription>
                                Kategori oranı boş bırakılırsa varsayılan oran kullanılır.
                            </FieldDescription>
                        </div>
                    </CardContent>
                </Card>
                    </TabsContent>

                    <TabsContent value="payments" className="mt-6 space-y-6">

                <Card>
                    <CardHeader>
                        <CardTitle>Ödeme Ayarları</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={data.iyzico_enabled}
                                onChange={(event) => setData('iyzico_enabled', event.target.checked)}
                            />
                            Iyzico aktif
                        </label>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="iyzico_api_key">Iyzico API Key</FieldLabel>
                                <Input
                                    id="iyzico_api_key"
                                    value={data.iyzico_api_key}
                                    onChange={(event) => setData('iyzico_api_key', event.target.value)}
                                />
                                <FieldError>{errors.iyzico_api_key}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="iyzico_secret_key">Iyzico Secret Key</FieldLabel>
                                <Input
                                    id="iyzico_secret_key"
                                    type="password"
                                    value={data.iyzico_secret_key}
                                    onChange={(event) => setData('iyzico_secret_key', event.target.value)}
                                />
                                <FieldError>{errors.iyzico_secret_key}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="iyzico_base_url">Iyzico Base URL</FieldLabel>
                                <Input
                                    id="iyzico_base_url"
                                    value={data.iyzico_base_url}
                                    onChange={(event) => setData('iyzico_base_url', event.target.value)}
                                />
                                <FieldError>{errors.iyzico_base_url}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="iyzico_callback_url">Iyzico Callback URL</FieldLabel>
                                <Input
                                    id="iyzico_callback_url"
                                    value={data.iyzico_callback_url}
                                    onChange={(event) => setData('iyzico_callback_url', event.target.value)}
                                />
                                <FieldError>{errors.iyzico_callback_url}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="iyzico_webhook_secret">Iyzico Webhook Secret</FieldLabel>
                                <Input
                                    id="iyzico_webhook_secret"
                                    type="password"
                                    value={data.iyzico_webhook_secret}
                                    onChange={(event) => setData('iyzico_webhook_secret', event.target.value)}
                                />
                                <FieldError>{errors.iyzico_webhook_secret}</FieldError>
                            </Field>
                        </div>
                    </CardContent>
                </Card>
                    </TabsContent>

                    <TabsContent value="shipping" className="mt-6 space-y-6">

                        <Card>
                            <CardHeader>
                                <CardTitle>Kargo ve Geliver Ayarları</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={data.free_shipping_enabled}
                                    onChange={(event) => setData('free_shipping_enabled', event.target.checked)}
                                />
                                Kargo bedava kampanyası aktif
                            </label>
                            <Field>
                                <FieldLabel htmlFor="free_shipping_minimum">Bedava Kargo Alt Limiti</FieldLabel>
                                <Input
                                    id="free_shipping_minimum"
                                    type="number"
                                    step="0.01"
                                    value={data.free_shipping_minimum}
                                    onChange={(event) => setData('free_shipping_minimum', Number(event.target.value))}
                                />
                                <FieldError>{errors.free_shipping_minimum}</FieldError>
                            </Field>
                        </div>

                        <Separator />

                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={data.geliver_enabled}
                                onChange={(event) => setData('geliver_enabled', event.target.checked)}
                            />
                            Geliver aktif
                        </label>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="geliver_token">Geliver Token</FieldLabel>
                                <Input
                                    id="geliver_token"
                                    value={data.geliver_token}
                                    onChange={(event) => setData('geliver_token', event.target.value)}
                                />
                                <FieldError>{errors.geliver_token}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="geliver_sender_address_id">Sender Address ID</FieldLabel>
                                <Input
                                    id="geliver_sender_address_id"
                                    value={data.geliver_sender_address_id}
                                    onChange={(event) => setData('geliver_sender_address_id', event.target.value)}
                                />
                                <FieldError>{errors.geliver_sender_address_id}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="geliver_source_identifier">Source Identifier</FieldLabel>
                                <Input
                                    id="geliver_source_identifier"
                                    value={data.geliver_source_identifier}
                                    onChange={(event) => setData('geliver_source_identifier', event.target.value)}
                                />
                                <FieldError>{errors.geliver_source_identifier}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="geliver_webhook_secret">Webhook Secret</FieldLabel>
                                <Input
                                    id="geliver_webhook_secret"
                                    type="password"
                                    value={data.geliver_webhook_secret}
                                    onChange={(event) => setData('geliver_webhook_secret', event.target.value)}
                                />
                                <FieldError>{errors.geliver_webhook_secret}</FieldError>
                            </Field>
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={data.geliver_webhook_verify}
                                    onChange={(event) => setData('geliver_webhook_verify', event.target.checked)}
                                />
                                Webhook doğrulama
                            </label>
                        </div>

                        <Separator />

                        <div className="grid gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="geliver_default_city_code">Varsayılan Şehir Kodu</FieldLabel>
                                <Input
                                    id="geliver_default_city_code"
                                    value={data.geliver_default_city_code}
                                    onChange={(event) => setData('geliver_default_city_code', event.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="geliver_distance_unit">Mesafe Birimi</FieldLabel>
                                <Input
                                    id="geliver_distance_unit"
                                    value={data.geliver_distance_unit}
                                    onChange={(event) => setData('geliver_distance_unit', event.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="geliver_mass_unit">Ağırlık Birimi</FieldLabel>
                                <Input
                                    id="geliver_mass_unit"
                                    value={data.geliver_mass_unit}
                                    onChange={(event) => setData('geliver_mass_unit', event.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="geliver_default_length">Paket Uzunluğu</FieldLabel>
                                <Input
                                    id="geliver_default_length"
                                    type="number"
                                    step="0.01"
                                    value={data.geliver_default_length}
                                    onChange={(event) => setData('geliver_default_length', Number(event.target.value))}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="geliver_default_width">Paket Genişliği</FieldLabel>
                                <Input
                                    id="geliver_default_width"
                                    type="number"
                                    step="0.01"
                                    value={data.geliver_default_width}
                                    onChange={(event) => setData('geliver_default_width', Number(event.target.value))}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="geliver_default_height">Paket Yüksekliği</FieldLabel>
                                <Input
                                    id="geliver_default_height"
                                    type="number"
                                    step="0.01"
                                    value={data.geliver_default_height}
                                    onChange={(event) => setData('geliver_default_height', Number(event.target.value))}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="geliver_default_weight">Paket Ağırlığı</FieldLabel>
                                <Input
                                    id="geliver_default_weight"
                                    type="number"
                                    step="0.01"
                                    value={data.geliver_default_weight}
                                    onChange={(event) => setData('geliver_default_weight', Number(event.target.value))}
                                />
                            </Field>
                        </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contact" className="mt-6 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Kaydırmalı Duyuru</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Field>
                                    <div className="flex items-center justify-between">
                                        <FieldLabel>Duyuru Aktif</FieldLabel>
                                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <input
                                                type="checkbox"
                                                checked={data.announcement_enabled}
                                                onChange={(event) => setData('announcement_enabled', event.target.checked)}
                                            />
                                            Aktif
                                        </label>
                                    </div>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="announcement_text">Duyuru Metni</FieldLabel>
                                    <Input
                                        id="announcement_text"
                                        value={data.announcement_text}
                                        onChange={(event) => setData('announcement_text', event.target.value)}
                                        placeholder="Yeni sezon ürünlerinde %20 indirim!"
                                    />
                                    <FieldError>{errors.announcement_text}</FieldError>
                                </Field>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <Field>
                                        <FieldLabel htmlFor="announcement_speed_seconds">Hız (sn)</FieldLabel>
                                        <Input
                                            id="announcement_speed_seconds"
                                            type="number"
                                            min={6}
                                            max={60}
                                            value={data.announcement_speed_seconds}
                                            onChange={(event) =>
                                                setData('announcement_speed_seconds', Number(event.target.value))
                                            }
                                        />
                                        <FieldError>{errors.announcement_speed_seconds}</FieldError>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="announcement_background">Arka Plan</FieldLabel>
                                        <Input
                                            id="announcement_background"
                                            value={data.announcement_background}
                                            onChange={(event) =>
                                                setData('announcement_background', event.target.value)
                                            }
                                            placeholder="#181113"
                                        />
                                        <FieldError>{errors.announcement_background}</FieldError>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="announcement_text_color">Yazı Rengi</FieldLabel>
                                        <Input
                                            id="announcement_text_color"
                                            value={data.announcement_text_color}
                                            onChange={(event) =>
                                                setData('announcement_text_color', event.target.value)
                                            }
                                            placeholder="#ffffff"
                                        />
                                        <FieldError>{errors.announcement_text_color}</FieldError>
                                    </Field>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>WhatsApp Destek</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Field>
                                    <div className="flex items-center justify-between">
                                        <FieldLabel>WhatsApp Aktif</FieldLabel>
                                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <input
                                                type="checkbox"
                                                checked={data.whatsapp_enabled}
                                                onChange={(event) => setData('whatsapp_enabled', event.target.checked)}
                                            />
                                            Aktif
                                        </label>
                                    </div>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="whatsapp_phone">WhatsApp Telefon</FieldLabel>
                                    <Input
                                        id="whatsapp_phone"
                                        value={data.whatsapp_phone}
                                        onChange={(event) => setData('whatsapp_phone', event.target.value)}
                                        placeholder="905559621600"
                                    />
                                    <FieldDescription>Ülke kodu ile, boşluk olmadan.</FieldDescription>
                                    <FieldError>{errors.whatsapp_phone}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="whatsapp_message">WhatsApp Mesajı</FieldLabel>
                                    <textarea
                                        id="whatsapp_message"
                                        value={data.whatsapp_message}
                                        onChange={(event) => setData('whatsapp_message', event.target.value)}
                                        rows={3}
                                        className="flex min-h-[90px] w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Selamlar bu ürünü almak istiyorum."
                                    />
                                    <FieldError>{errors.whatsapp_message}</FieldError>
                                </Field>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="home" className="mt-6 space-y-6">

                <Card>
                    <CardHeader>
                        <CardTitle>Anasayfa Ayarları</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-[#181113] dark:text-white">
                                        Hero Slider
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Anasayfa slider görsellerini ve metinlerini yönetin.
                                    </p>
                                </div>
                                <Button type="button" variant="outline" onClick={addHeroSlide}>
                                    Slider Ekle
                                </Button>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="home_hero_autoplay_ms">Slider Hızı (ms)</FieldLabel>
                                <Input
                                    id="home_hero_autoplay_ms"
                                    type="number"
                                    min={1000}
                                    max={60000}
                                    value={data.home_hero_autoplay_ms}
                                    onChange={(event) => setData('home_hero_autoplay_ms', Number(event.target.value))}
                                />
                                <FieldDescription>Örn: 6000 = 6 saniye</FieldDescription>
                                <FieldError>{errors.home_hero_autoplay_ms}</FieldError>
                            </Field>

                            {data.home_hero_slides.length === 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Henüz slider eklenmedi.
                                </p>
                            )}

                            <div className="space-y-6">
                                {data.home_hero_slides.map((slide, slideIndex) => {
                                    const previewUrl = toStorageUrl(slide.image_path);

                                    return (
                                        <div
                                            key={slideIndex}
                                            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950"
                                        >
                                            <div className="mb-4 flex items-center justify-between">
                                                <p className="text-sm font-semibold text-[#181113] dark:text-white">
                                                    Slider #{slideIndex + 1}
                                                </p>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={() => removeHeroSlide(slideIndex)}
                                                >
                                                    Sil
                                                </Button>
                                            </div>

                                            <div className="grid gap-4 lg:grid-cols-[180px,1fr]">
                                                <div className="space-y-3">
                                                    <div className="h-28 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                                                        {previewUrl ? (
                                                            <img
                                                                src={previewUrl}
                                                                alt={`Hero ${slideIndex + 1}`}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                                                Görsel Yok
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setImagePickerTarget({ type: 'hero', slideIndex })}
                                                    >
                                                        Görsel Seç
                                                    </Button>
                                                    <FieldError>
                                                        {errors[`home_hero_slides.${slideIndex}.image_path`]}
                                                    </FieldError>
                                                </div>

                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <Field>
                                                        <FieldLabel>Üst Başlık</FieldLabel>
                                                        <Input
                                                            value={slide.eyebrow}
                                                            onChange={(event) =>
                                                                updateHeroSlide(slideIndex, 'eyebrow', event.target.value)
                                                            }
                                                        />
                                                        <FieldError>{errors[`home_hero_slides.${slideIndex}.eyebrow`]}</FieldError>
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel>Başlık</FieldLabel>
                                                        <Input
                                                            value={slide.title}
                                                            onChange={(event) =>
                                                                updateHeroSlide(slideIndex, 'title', event.target.value)
                                                            }
                                                        />
                                                        <FieldError>{errors[`home_hero_slides.${slideIndex}.title`]}</FieldError>
                                                    </Field>
                                                    <Field className="md:col-span-2">
                                                        <FieldLabel>Açıklama</FieldLabel>
                                                        <textarea
                                                            value={slide.subtitle}
                                                            onChange={(event) =>
                                                                updateHeroSlide(slideIndex, 'subtitle', event.target.value)
                                                            }
                                                            rows={3}
                                                            className="flex min-h-[90px] w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                        />
                                                        <FieldError>{errors[`home_hero_slides.${slideIndex}.subtitle`]}</FieldError>
                                                    </Field>
                                                </div>
                                            </div>

                                            <div className="mt-5 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                                        Butonlar
                                                    </p>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addHeroButton(slideIndex)}
                                                    >
                                                        Buton Ekle
                                                    </Button>
                                                </div>
                                                {slide.buttons.length === 0 && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Henüz buton eklenmedi.
                                                    </p>
                                                )}
                                                <div className="space-y-3">
                                                    {slide.buttons.map((button, buttonIndex) => (
                                                        <div
                                                            key={buttonIndex}
                                                            className="grid gap-3 rounded-xl border border-gray-100 p-3 dark:border-gray-800"
                                                        >
                                                            <div className="grid gap-3 md:grid-cols-3">
                                                                <Field>
                                                                    <FieldLabel>Buton Metni</FieldLabel>
                                                                    <Input
                                                                        value={button.label}
                                                                        onChange={(event) =>
                                                                            updateHeroButton(
                                                                                slideIndex,
                                                                                buttonIndex,
                                                                                'label',
                                                                                event.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                    <FieldError>
                                                                        {errors[`home_hero_slides.${slideIndex}.buttons.${buttonIndex}.label`]}
                                                                    </FieldError>
                                                                </Field>
                                                                <Field className="md:col-span-2">
                                                                    <FieldLabel>Buton URL</FieldLabel>
                                                                    <Input
                                                                        value={button.url}
                                                                        onChange={(event) =>
                                                                            updateHeroButton(
                                                                                slideIndex,
                                                                                buttonIndex,
                                                                                'url',
                                                                                event.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                    <FieldError>
                                                                        {errors[`home_hero_slides.${slideIndex}.buttons.${buttonIndex}.url`]}
                                                                    </FieldError>
                                                                </Field>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <Select
                                                                    value={button.variant ?? 'primary'}
                                                                    onValueChange={(value) =>
                                                                        updateHeroButton(
                                                                            slideIndex,
                                                                            buttonIndex,
                                                                            'variant',
                                                                            value
                                                                        )
                                                                    }
                                                                >
                                                                    <SelectTrigger className="w-[200px]">
                                                                        <SelectValue placeholder="Buton stili" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="primary">Primary</SelectItem>
                                                                        <SelectItem value="secondary">Secondary</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => removeHeroButton(slideIndex, buttonIndex)}
                                                                >
                                                                    Sil
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel>Marka Sıralaması</FieldLabel>
                                <Select
                                    value={data.home_brands_sort_by}
                                    onValueChange={(value) => setData('home_brands_sort_by', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="title">Başlık</SelectItem>
                                        <SelectItem value="created_at">Oluşturma Tarihi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel>Marka Sıralama Yönü</FieldLabel>
                                <Select
                                    value={data.home_brands_sort_direction}
                                    onValueChange={(value) => setData('home_brands_sort_direction', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="asc">Artan</SelectItem>
                                        <SelectItem value="desc">Azalan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel>Ürün Grid Sıralaması</FieldLabel>
                                <Select
                                    value={data.home_product_grid_sort_by}
                                    onValueChange={(value) => setData('home_product_grid_sort_by', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="title">Başlık</SelectItem>
                                        <SelectItem value="created_at">Oluşturma Tarihi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel>Ürün Grid Sıralama Yönü</FieldLabel>
                                <Select
                                    value={data.home_product_grid_sort_direction}
                                    onValueChange={(value) => setData('home_product_grid_sort_direction', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="asc">Artan</SelectItem>
                                        <SelectItem value="desc">Azalan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>
                    </CardContent>
                </Card>
                    </TabsContent>

                    <TabsContent value="catalog" className="mt-6 space-y-6">

                <Card>
                    <CardHeader>
                        <CardTitle>Katalog Ayarları</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="products_per_page">Ürün Sayısı (sayfa başına)</FieldLabel>
                                <Input
                                    id="products_per_page"
                                    type="number"
                                    value={data.products_per_page}
                                    onChange={(event) => setData('products_per_page', Number(event.target.value))}
                                />
                                <FieldError>{errors.products_per_page}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="brands_per_page">Marka Sayısı (sayfa başına)</FieldLabel>
                                <Input
                                    id="brands_per_page"
                                    type="number"
                                    value={data.brands_per_page}
                                    onChange={(event) => setData('brands_per_page', Number(event.target.value))}
                                />
                                <FieldError>{errors.brands_per_page}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="categories_per_page">Kategori Sayısı (sayfa başına)</FieldLabel>
                                <Input
                                    id="categories_per_page"
                                    type="number"
                                    value={data.categories_per_page}
                                    onChange={(event) => setData('categories_per_page', Number(event.target.value))}
                                />
                                <FieldError>{errors.categories_per_page}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="tags_per_page">Etiket Sayısı (sayfa başına)</FieldLabel>
                                <Input
                                    id="tags_per_page"
                                    type="number"
                                    value={data.tags_per_page}
                                    onChange={(event) => setData('tags_per_page', Number(event.target.value))}
                                />
                                <FieldError>{errors.tags_per_page}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="ingredients_per_page">Malzeme Sayısı (sayfa başına)</FieldLabel>
                                <Input
                                    id="ingredients_per_page"
                                    type="number"
                                    value={data.ingredients_per_page}
                                    onChange={(event) => setData('ingredients_per_page', Number(event.target.value))}
                                />
                                <FieldError>{errors.ingredients_per_page}</FieldError>
                            </Field>
                        </div>
                    </CardContent>
                </Card>
                    </TabsContent>
                </Tabs>
            </form>

            <ImagePickerModal
                open={Boolean(imagePickerTarget)}
                onOpenChange={(open) => {
                    if (!open) {
                        setImagePickerTarget(null);
                    }
                }}
                onSelect={(url) => handleLogoSelect(url)}
            />
        </AppLayout>
    );
}
