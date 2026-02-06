import StorefrontLayout from '@/layouts/storefront/storefront-layout';
import { Link, usePage } from '@inertiajs/react';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { SharedData } from '@/types';

type CartTotals = {
    currency: string;
    subtotal: number;
    discount_total: number;
    tax_total: number;
    shipping_total: number;
    grand_total: number;
    items?: Array<{
        id: number;
        title: string;
        qty: number;
        unit_effective: number;
        line_subtotal: number;
    }>;
};

type Address = {
    full_name: string;
    phone?: string | null;
    email?: string | null;
    country: string;
    city: string;
    district?: string | null;
    line1: string;
    line2?: string | null;
    postal_code?: string | null;
};

type ShippingRate = {
    provider: string;
    service_code: string;
    service_name: string;
    amount: number;
};

type CheckoutSummaryResponse = {
    address: Partial<Address>;
    selected_shipping: ShippingRate | null;
    totals: CartTotals;
};

type RatesResponse = CheckoutSummaryResponse & {
    rates: ShippingRate[];
};

type ConfirmResponse = {
    order_id: number;
    status: string;
    totals: CartTotals;
};

type PaymentInitResponse = {
    provider_status: string;
    payment_status: string;
    message?: string;
    redirect_url?: string | null;
};

type CheckoutPageProps = {
    address: Partial<Address>;
    selectedShipping: ShippingRate | null;
    totals: CartTotals;
    contractPage?: {
        title: string;
        content: string | null;
    } | null;
    apiEndpoints: {
        summary: string;
        address: string;
        rates: string;
        selectShipping: string;
        confirm: string;
        initializePayment: string;
        cartPage: string;
    };
};

type FlashProps = {
    paymentStatus?: string | null;
    orderId?: number | null;
};

/** Decode HTML entities so backend-escaped content renders as HTML. SSR-safe. */
function decodeHtmlEntities(html: string): string {
    if (!html) return '';
    return html
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/gi, "'");
}

const emptyAddress: Address = {
    full_name: '',
    phone: '',
    email: '',
    country: 'TR',
    city: '',
    district: '',
    line1: '',
    line2: '',
    postal_code: '',
};

export default function CheckoutPage({ address: initialAddress, selectedShipping: initialSelectedShipping, totals: initialTotals, contractPage, apiEndpoints }: CheckoutPageProps) {
    const { flash, storefrontSettings } = usePage<SharedData & { flash?: FlashProps }>().props;
    const [address, setAddress] = useState<Address>({ ...emptyAddress, ...initialAddress });
    const [selectedShipping, setSelectedShipping] = useState<ShippingRate | null>(initialSelectedShipping);
    const [rates, setRates] = useState<ShippingRate[]>([]);
    const [totals, setTotals] = useState<CartTotals>(initialTotals);
    const [orderId, setOrderId] = useState<number | null>(null);
    const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isContractOpen, setIsContractOpen] = useState(false);
    const [hasAcceptedContract, setHasAcceptedContract] = useState(false);

    const currency = useMemo(() => totals.currency ?? 'TRY', [totals.currency]);
    const formatMoney = useCallback(
        (value: number) =>
            new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency,
            }).format(value ?? 0),
        [currency],
    );

    const contractHtml = useMemo(() => {
        if (!contractPage?.content) {
            return '';
        }

        const billingBlock = `
            <p><strong>Fatura Bilgileri</strong></p>
            <p>Ad/Soyad/Unvan: ${address.full_name || '-'}</p>
            <p>Adres: ${address.line1 || '-'}</p>
            <p>Telefon: ${address.phone || '-'}</p>
            <p>Eposta/kullanıcı adı: ${address.email || '-'}</p>
        `;

        const totalsTable = `
            <table style=\"width:100%;border-collapse:collapse;margin-top:12px\">
                <thead>
                    <tr>
                        <th style=\"border:1px solid #ddd;padding:6px;text-align:left\">Ürün Açıklaması</th>
                        <th style=\"border:1px solid #ddd;padding:6px;text-align:left\">Adet</th>
                        <th style=\"border:1px solid #ddd;padding:6px;text-align:left\">Birim Fiyatı</th>
                        <th style=\"border:1px solid #ddd;padding:6px;text-align:left\">Ara Toplam (KDV Dahil)</th>
                    </tr>
                </thead>
                <tbody>
                    ${(totals.items ?? [])
                        .map(
                            (item) => `
                        <tr>
                            <td style=\"border:1px solid #ddd;padding:6px\">${item.title}</td>
                            <td style=\"border:1px solid #ddd;padding:6px\">${item.qty}</td>
                            <td style=\"border:1px solid #ddd;padding:6px\">${formatMoney(item.unit_effective)}</td>
                            <td style=\"border:1px solid #ddd;padding:6px\">${formatMoney(item.line_subtotal)}</td>
                        </tr>
                    `,
                        )
                        .join('')}
                </tbody>
            </table>
            <p style=\"margin-top:12px\">Kargo Tutarı: ${formatMoney(totals.shipping_total)}</p>
            <p>Vergi Tutarı: ${formatMoney(totals.tax_total)}</p>
            <p><strong>Toplam: ${formatMoney(totals.grand_total)}</strong></p>
        `;

        const seller = storefrontSettings?.site;

        const replacements: Record<string, string> = {
            '{{BUYER_NAME}}': address.full_name || '-',
            '{{BUYER_ADDRESS}}': address.line1 || '-',
            '{{BUYER_PHONE}}': address.phone || '-',
            '{{BUYER_EMAIL}}': address.email || '-',
            '{{SELLER_NAME}}': seller?.seller_name || '-',
            '{{SELLER_ADDRESS}}': seller?.seller_address || '-',
            '{{SELLER_PHONE}}': seller?.seller_phone || '-',
            '{{SELLER_EMAIL}}': seller?.seller_email || '-',
            '{{ORDER_SUMMARY}}': totalsTable,
            '{{BILLING_INFO}}': billingBlock,
        };

        let html = contractPage.content;
        Object.entries(replacements).forEach(([key, value]) => {
            html = html.replaceAll(key, value);
        });

        return html;
    }, [contractPage, totals, formatMoney, address, storefrontSettings]);

    const loadSummary = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(apiEndpoints.summary, {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            });
            const data = (await response.json()) as CheckoutSummaryResponse;
            if (data?.totals) {
                setTotals(data.totals);
            }
            if (data?.address) {
                setAddress((prev) => ({ ...prev, ...data.address }));
            }
            setSelectedShipping(data?.selected_shipping ?? null);
        } catch (error) {
            console.error('Checkout summary fetch failed:', error);
        } finally {
            setLoading(false);
        }
    }, [apiEndpoints.summary]);

    useEffect(() => {
        loadSummary();
    }, [loadSummary]);

    const submitAddress = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setPaymentMessage(null);
        try {
            const response = await fetch(apiEndpoints.address, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify(address),
            });
            const data = (await response.json()) as CheckoutSummaryResponse;
            if (data?.totals) {
                setTotals(data.totals);
            }
            await fetchRates();
        } catch (error) {
            console.error('Address submit failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRates = async () => {
        try {
            const response = await fetch(apiEndpoints.rates, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ address }),
            });
            const data = (await response.json()) as RatesResponse;
            setRates(Array.isArray(data?.rates) ? data.rates : []);
            if (data?.totals) {
                setTotals(data.totals);
            }
        } catch (error) {
            console.error('Shipping rates fetch failed:', error);
        }
    };

    const selectShipping = async (serviceCode: string) => {
        setLoading(true);
        setPaymentMessage(null);
        try {
            const response = await fetch(apiEndpoints.selectShipping, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ service_code: serviceCode }),
            });
            const data = (await response.json()) as CheckoutSummaryResponse;
            setSelectedShipping(data.selected_shipping ?? null);
            if (data?.totals) {
                setTotals(data.totals);
            }
        } catch (error) {
            console.error('Shipping select failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const confirmCheckout = async () => {
        setLoading(true);
        setPaymentMessage(null);
        try {
            const response = await fetch(apiEndpoints.confirm, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            });
            const data = (await response.json()) as ConfirmResponse & { message?: string; errors?: Record<string, string[]> };
            setOrderId(data.order_id ?? null);
            if (data?.totals) {
                setTotals(data.totals);
            }

            if (!response.ok) {
                const msg = data?.message ?? data?.errors?.order_id?.[0] ?? 'Siparis olusturulamadi.';
                setPaymentMessage(msg);
                return;
            }
            const orderId = data.order_id;
            if (orderId == null || typeof orderId !== 'number') {
                setPaymentMessage('Siparis yaniti gecersiz.');
                return;
            }
            await initializePayment(orderId);
        } catch (error) {
            console.error('Checkout confirm failed:', error);
            setPaymentMessage('Siparis olusturulurken hata olustu.');
        } finally {
            setLoading(false);
        }
    };

    const initializePayment = async (order_id: number) => {
        try {
            const response = await fetch(apiEndpoints.initializePayment, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ order_id }),
            });
            const data = (await response.json()) as PaymentInitResponse;

            if (data.redirect_url) {
                window.location.assign(data.redirect_url);
                return;
            }

            setPaymentMessage(data.message ?? 'Odeme baslatildi.');
        } catch (error) {
            console.error('Payment initialize failed:', error);
        }
    };

    return (
        <StorefrontLayout title="Checkout">
            <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
                {flash?.paymentStatus ? (
                    <div
                        className={`rounded border px-4 py-3 text-sm ${
                            flash.paymentStatus === 'success'
                                ? 'border-green-600 text-green-700'
                                : 'border-red-600 text-red-700'
                        }`}
                    >
                        {flash.paymentStatus === 'success' ? 'Odeme basarili.' : 'Odeme basarisiz.'}
                        {flash.orderId ? <span className="ml-2">Siparis: #{flash.orderId}</span> : null}
                    </div>
                ) : null}

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Checkout</h1>
                    <Link href={apiEndpoints.cartPage} className="text-sm underline">
                        Sepete Don
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        <form onSubmit={submitAddress} className="space-y-3 rounded border p-4">
                            <div className="text-sm font-medium">Teslimat Adresi</div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <input
                                    className="rounded border px-3 py-2 text-sm"
                                    placeholder="Ad Soyad"
                                    value={address.full_name}
                                    onChange={(e) => setAddress((prev) => ({ ...prev, full_name: e.target.value }))}
                                />
                                <input
                                    className="rounded border px-3 py-2 text-sm"
                                    placeholder="Telefon"
                                    value={address.phone ?? ''}
                                    onChange={(e) => setAddress((prev) => ({ ...prev, phone: e.target.value }))}
                                />
                                <input
                                    className="rounded border px-3 py-2 text-sm sm:col-span-2"
                                    placeholder="E-posta"
                                    value={address.email ?? ''}
                                    onChange={(e) => setAddress((prev) => ({ ...prev, email: e.target.value }))}
                                />
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                <input
                                    className="rounded border px-3 py-2 text-sm"
                                    placeholder="Ulke"
                                    value={address.country}
                                    onChange={(e) => setAddress((prev) => ({ ...prev, country: e.target.value }))}
                                />
                                <input
                                    className="rounded border px-3 py-2 text-sm"
                                    placeholder="Sehir"
                                    value={address.city}
                                    onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
                                />
                                <input
                                    className="rounded border px-3 py-2 text-sm"
                                    placeholder="Ilce"
                                    value={address.district ?? ''}
                                    onChange={(e) => setAddress((prev) => ({ ...prev, district: e.target.value }))}
                                />
                            </div>

                            <div className="grid gap-3">
                                <input
                                    className="rounded border px-3 py-2 text-sm"
                                    placeholder="Adres satiri"
                                    value={address.line1}
                                    onChange={(e) => setAddress((prev) => ({ ...prev, line1: e.target.value }))}
                                />
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <input
                                        className="rounded border px-3 py-2 text-sm"
                                        placeholder="Adres satiri 2"
                                        value={address.line2 ?? ''}
                                        onChange={(e) => setAddress((prev) => ({ ...prev, line2: e.target.value }))}
                                    />
                                    <input
                                        className="rounded border px-3 py-2 text-sm"
                                        placeholder="Posta kodu"
                                        value={address.postal_code ?? ''}
                                        onChange={(e) => setAddress((prev) => ({ ...prev, postal_code: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                                >
                                    Adresi Kaydet ve Kargo Hesapla
                                </button>
                            </div>
                        </form>

                        <div className="space-y-3 rounded border p-4">
                            <div className="text-sm font-medium">Kargo Secimi</div>
                            {rates.length === 0 ? (
                                <div className="text-xs text-muted-foreground">
                                    Oranlari gormek icin once adresi kaydedin.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {rates.map((rate) => {
                                        const isSelected = selectedShipping?.service_code === rate.service_code;
                                        return (
                                            <button
                                                key={rate.service_code}
                                                type="button"
                                                onClick={() => selectShipping(rate.service_code)}
                                                className={`flex w-full items-center justify-between rounded border px-3 py-2 text-left text-sm ${
                                                    isSelected ? 'border-black' : ''
                                                }`}
                                            >
                                                <span>
                                                    {rate.service_name}
                                                    <span className="ml-2 text-xs text-muted-foreground">({rate.service_code})</span>
                                                </span>
                                                <span className="font-medium">{formatMoney(rate.amount)}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 rounded border p-4">
                            <div className="text-sm font-medium">Onay</div>
                            {contractPage ? (
                                <div className="flex flex-col gap-2 rounded border border-dashed p-3 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setIsContractOpen(true)}
                                        className="text-left font-semibold text-[#ec135b] underline"
                                    >
                                        {contractPage.title || 'Mesafeli Satış Sözleşmesi'}
                                    </button>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={hasAcceptedContract}
                                            onChange={(event) => setHasAcceptedContract(event.target.checked)}
                                        />
                                        Sözleşmeyi okudum, kabul ediyorum.
                                    </label>
                                </div>
                            ) : null}
                            <button
                                type="button"
                                onClick={confirmCheckout}
                                disabled={loading || !selectedShipping || (contractPage ? !hasAcceptedContract : false)}
                                className="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                            >
                                Siparisi Olustur ve Odemeye Gec
                            </button>

                            {orderId ? (
                                <div className="text-xs text-muted-foreground">Siparis No: #{orderId}</div>
                            ) : null}
                            {paymentMessage ? (
                                <div className="text-xs text-muted-foreground">{paymentMessage}</div>
                            ) : null}
                        </div>
                    </div>

                    <div className="space-y-3 rounded border p-4">
                        <div className="flex items-center justify-between text-sm">
                            <span>Ara Toplam</span>
                            <span>{formatMoney(totals.subtotal)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span>Vergi</span>
                            <span>{formatMoney(totals.tax_total)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span>Kargo</span>
                            <span>{formatMoney(totals.shipping_total)}</span>
                        </div>
                        <div className="my-2 h-px bg-border" />
                        <div className="flex items-center justify-between text-base font-semibold">
                            <span>Genel Toplam</span>
                            <span>{formatMoney(totals.grand_total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {contractPage ? (
                <Dialog open={isContractOpen} onOpenChange={setIsContractOpen}>
                    <DialogContent className="sm:max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>{contractPage.title || 'Mesafeli Satış Sözleşmesi'}</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[70vh] overflow-y-auto rounded-md border p-4 text-sm leading-relaxed">
                            {contractHtml ? (
                                <div
                                    className="prose max-w-none text-sm"
                                    dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(contractHtml) }}
                                />
                            ) : (
                                <p>Sözleşme içeriği bulunamadı.</p>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            ) : null}
        </StorefrontLayout>
    );
}
