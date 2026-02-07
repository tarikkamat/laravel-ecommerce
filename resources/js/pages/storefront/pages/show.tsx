import StorefrontLayout from '@/layouts/storefront/storefront-layout';
import { useState } from 'react';

type PageShowProps = {
    page: {
        id: number;
        title: string;
        slug: string;
        type: 'contract' | 'flat' | 'contact';
        content: string | null;
        contact_email: string | null;
        contact_phone: string | null;
        contact_address: string | null;
    };
    apiEndpoints?: {
        contact: string;
    };
};

type ContactFormState = {
    name: string;
    email: string;
    phone: string;
    message: string;
};

const getCsrfToken = (): string => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta?.getAttribute('content') ?? '';
};

export default function PageShow({ page, apiEndpoints }: PageShowProps) {
    const normalizeSlug = (value: string) =>
        value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/ı/g, 'i')
            .toLowerCase()
            .trim();

    const isContactPage = page.type === 'contact' || normalizeSlug(page.slug) === 'iletisim';
    const [form, setForm] = useState<ContactFormState>({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({});
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitContact = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!apiEndpoints?.contact) {
            return;
        }

        setIsSubmitting(true);
        setErrors({});
        setStatusMessage(null);

        try {
            const response = await fetch(apiEndpoints.contact, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => null);
                const fieldErrors = payload?.errors ?? {};
                if (fieldErrors) {
                    setErrors({
                        name: fieldErrors.name?.[0],
                        email: fieldErrors.email?.[0],
                        phone: fieldErrors.phone?.[0],
                        message: fieldErrors.message?.[0],
                    });
                }
                setStatusMessage(payload?.message ?? 'Mesaj gönderilemedi.');
                return;
            }

            setStatusMessage('Mesajınız iletildi.');
            setForm((prev) => ({ ...prev, message: '' }));
        } catch (error) {
            console.error('Contact form failed:', error);
            setStatusMessage('Mesaj gönderilemedi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <StorefrontLayout title={page.title}>
            <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10">
                <div>
                    <h1 className="text-3xl font-bold">{page.title}</h1>
                    {page.type === 'contract' ? (
                        <p className="mt-2 text-sm text-muted-foreground">Sözleşme metni</p>
                    ) : null}
                    {page.type === 'contact' ? (
                        <p className="mt-2 text-sm text-muted-foreground">İletişim bilgileri</p>
                    ) : null}
                </div>

                {isContactPage ? (
                    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                        <div className="space-y-4">
                            <div className="rounded border p-4 text-sm">
                                <div className="font-semibold">E-posta</div>
                                <div className="text-muted-foreground">{page.contact_email || '-'}</div>
                            </div>
                            <div className="rounded border p-4 text-sm">
                                <div className="font-semibold">Telefon</div>
                                <div className="text-muted-foreground">{page.contact_phone || '-'}</div>
                            </div>
                            <div className="rounded border p-4 text-sm">
                                <div className="font-semibold">Adres</div>
                                <div className="text-muted-foreground whitespace-pre-line">
                                    {page.contact_address || '-'}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submitContact} className="space-y-3 rounded border p-4 text-sm">
                            <div className="text-base font-semibold">İletişim Formu</div>
                            <div className="space-y-2">
                                <input
                                    className="w-full rounded border px-3 py-2 text-sm"
                                    placeholder="Ad Soyad"
                                    value={form.name}
                                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                                    required
                                />
                                {errors.name ? <div className="text-xs text-destructive">{errors.name}</div> : null}
                            </div>
                            <div className="space-y-2">
                                <input
                                    type="email"
                                    className="w-full rounded border px-3 py-2 text-sm"
                                    placeholder="E-posta"
                                    value={form.email}
                                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                                    required
                                />
                                {errors.email ? <div className="text-xs text-destructive">{errors.email}</div> : null}
                            </div>
                            <div className="space-y-2">
                                <input
                                    className="w-full rounded border px-3 py-2 text-sm"
                                    placeholder="Telefon (opsiyonel)"
                                    value={form.phone}
                                    onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                                />
                                {errors.phone ? <div className="text-xs text-destructive">{errors.phone}</div> : null}
                            </div>
                            <div className="space-y-2">
                                <textarea
                                    className="min-h-[120px] w-full rounded border px-3 py-2 text-sm"
                                    placeholder="Mesajınız"
                                    value={form.message}
                                    onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                                    required
                                />
                                {errors.message ? <div className="text-xs text-destructive">{errors.message}</div> : null}
                            </div>
                            {statusMessage ? <div className="text-xs text-muted-foreground">{statusMessage}</div> : null}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                            >
                                Mesaj Gönder
                            </button>
                        </form>
                    </div>
                ) : null}

                {page.content ? (
                    <div
                        className="prose prose-sm max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                ) : (
                    <div className="rounded border p-6 text-sm text-muted-foreground">
                        Bu sayfa için içerik girilmemiş.
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
