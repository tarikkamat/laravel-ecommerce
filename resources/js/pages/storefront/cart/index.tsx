import StorefrontLayout from '@/layouts/storefront/storefront-layout';
import { Link } from '@inertiajs/react';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

type CartItem = {
    id: number;
    product_id: number;
    qty: number;
    title: string;
    sku: string | null;
    unit_price: number;
    unit_sale_price: number | null;
    unit_effective: number;
    line_subtotal: number;
};

type CartTotals = {
    currency: string;
    items: CartItem[];
    subtotal: number;
    discount_total: number;
    tax_total: number;
    shipping_total: number;
    grand_total: number;
};

type AppliedDiscount = {
    id: number;
    code: string;
    title: string;
    description?: string | null;
    type: 'percentage' | 'fixed_amount';
    value: number;
};

type CartSummaryResponse = {
    items_count: number;
    totals: CartTotals;
    discount?: AppliedDiscount | null;
    message?: string;
    errors?: Record<string, string[]>;
};

type CartPageProps = {
    itemsCount: number;
    totals: CartTotals;
    discount?: AppliedDiscount | null;
    apiEndpoints: {
        summary: string;
        addItem: string;
        updateItem: string;
        removeItem: string;
        clear: string;
        applyDiscount: string;
        removeDiscount: string;
        checkoutPage: string;
    };
};

export default function CartPage({ totals: initialTotals, discount: initialDiscount, apiEndpoints }: CartPageProps) {
    const [totals, setTotals] = useState<CartTotals>(initialTotals);
    const [loading, setLoading] = useState(false);
    const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(initialDiscount ?? null);
    const [discountCode, setDiscountCode] = useState(initialDiscount?.code ?? '');
    const [discountMessage, setDiscountMessage] = useState<string | null>(null);

    const currency = useMemo(() => totals.currency ?? 'TRY', [totals.currency]);

    const formatMoney = useCallback(
        (value: number) =>
            new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency,
            }).format(value ?? 0),
        [currency],
    );

    const applySummary = useCallback(
        (data?: CartSummaryResponse | null) => {
            if (!data) return;
            if (data?.totals) {
                setTotals(data.totals);
            }
            if ('discount' in data) {
                setAppliedDiscount(data.discount ?? null);
                if (data.discount?.code) {
                    setDiscountCode(data.discount.code);
                } else if (appliedDiscount) {
                    setDiscountCode('');
                }
            }
        },
        [appliedDiscount],
    );

    const loadSummary = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(apiEndpoints.summary, {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            });
            const data = (await response.json()) as CartSummaryResponse;
            applySummary(data);
        } catch (error) {
            console.error('Cart summary fetch failed:', error);
        } finally {
            setLoading(false);
        }
    }, [apiEndpoints.summary, applySummary]);

    useEffect(() => {
        loadSummary();
    }, [loadSummary]);

    const updateQty = async (itemId: number, qty: number) => {
        const endpoint = apiEndpoints.updateItem.replace('__ITEM_ID__', String(itemId));
        setLoading(true);
        try {
            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ qty }),
            });
            const data = (await response.json()) as CartSummaryResponse;
            applySummary(data);
        } catch (error) {
            console.error('Cart update failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (itemId: number) => {
        const endpoint = apiEndpoints.removeItem.replace('__ITEM_ID__', String(itemId));
        setLoading(true);
        try {
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            });
            const data = (await response.json()) as CartSummaryResponse;
            applySummary(data);
        } catch (error) {
            console.error('Cart remove failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        setLoading(true);
        try {
            const response = await fetch(apiEndpoints.clear, {
                method: 'DELETE',
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            });
            const data = (await response.json()) as CartSummaryResponse;
            applySummary(data);
        } catch (error) {
            console.error('Cart clear failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const submitDiscount = async (event: FormEvent) => {
        event.preventDefault();
        if (loading) return;
        await applyDiscount();
    };

    const applyDiscount = async () => {
        const code = discountCode.trim();
        if (!code) {
            setDiscountMessage('Kupon kodu girin.');
            return;
        }

        setLoading(true);
        setDiscountMessage(null);
        try {
            const response = await fetch(apiEndpoints.applyDiscount, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ code }),
            });
            const data = (await response.json()) as CartSummaryResponse;
            if (!response.ok) {
                const message = data?.message ?? data?.errors?.code?.[0] ?? 'Kupon kodu uygulanamadi.';
                setDiscountMessage(message);
                return;
            }
            applySummary(data);
        } catch (error) {
            console.error('Discount apply failed:', error);
            setDiscountMessage('Kupon kodu uygulanamadi.');
        } finally {
            setLoading(false);
        }
    };

    const removeDiscount = async () => {
        setLoading(true);
        setDiscountMessage(null);
        try {
            const response = await fetch(apiEndpoints.removeDiscount, {
                method: 'DELETE',
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            });
            const data = (await response.json()) as CartSummaryResponse;
            if (!response.ok) {
                const message = data?.message ?? 'Kupon kodu kaldirilamadi.';
                setDiscountMessage(message);
                return;
            }
            applySummary(data);
        } catch (error) {
            console.error('Discount remove failed:', error);
            setDiscountMessage('Kupon kodu kaldirilamadi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <StorefrontLayout title="Sepet">
            <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Sepetim</h1>
                    <button
                        type="button"
                        onClick={clearCart}
                        disabled={loading || totals.items.length === 0}
                        className="rounded border px-3 py-2 text-sm disabled:opacity-50"
                    >
                        Sepeti Temizle
                    </button>
                </div>

                {totals.items.length === 0 ? (
                    <div className="rounded border p-6 text-sm text-muted-foreground">
                        Sepetiniz bos.
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                        <div className="space-y-3">
                            {totals.items.map((item) => (
                                <div key={item.id} className="flex flex-col gap-3 rounded border p-4 sm:flex-row sm:items-center">
                                    <div className="flex-1">
                                        <div className="font-medium">{item.title}</div>
                                        {item.sku ? (
                                            <div className="text-xs text-muted-foreground">SKU: {item.sku}</div>
                                        ) : null}
                                        <div className="mt-1 text-sm text-muted-foreground">
                                            Birim: {item.unit_effective} TL
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => updateQty(item.id, item.qty - 1)}
                                            disabled={loading}
                                            className="h-9 w-9 rounded border"
                                        >
                                            -
                                        </button>
                                        <div className="w-10 text-center text-sm font-medium">{item.qty}</div>
                                        <button
                                            type="button"
                                            onClick={() => updateQty(item.id, item.qty + 1)}
                                            disabled={loading}
                                            className="h-9 w-9 rounded border"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                                        <div className="text-sm font-semibold">{formatMoney(item.line_subtotal)}</div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.id)}
                                            disabled={loading}
                                            className="text-xs text-red-600"
                                        >
                                            Kaldir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 rounded border p-4">
                            <div className="space-y-2">
                                <div className="text-sm font-medium">İndirim Kodu</div>
                                {appliedDiscount ? (
                                    <div className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                                        <div>
                                            <div className="font-medium">{appliedDiscount.code}</div>
                                            {appliedDiscount.title ? (
                                                <div className="text-xs text-muted-foreground">{appliedDiscount.title}</div>
                                            ) : null}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeDiscount}
                                            disabled={loading}
                                            className="text-xs text-red-600 disabled:opacity-50"
                                        >
                                            Kaldir
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={submitDiscount} className="flex items-center gap-2">
                                        <input
                                            className="h-9 flex-1 rounded border px-3 text-sm"
                                            placeholder="INDIRIM2024"
                                            value={discountCode}
                                            onChange={(event) => setDiscountCode(event.target.value.toUpperCase())}
                                            disabled={loading}
                                        />
                                        <button
                                            type="submit"
                                            disabled={loading || discountCode.trim() === ''}
                                            className="h-9 rounded bg-black px-3 text-xs font-medium text-white disabled:opacity-50"
                                        >
                                            Uygula
                                        </button>
                                    </form>
                                )}
                                {discountMessage ? (
                                    <div className="text-xs text-red-600">{discountMessage}</div>
                                ) : null}
                            </div>

                            <div className="my-1 h-px bg-border" />
                            <div className="flex items-center justify-between text-sm">
                                <span>Ara Toplam</span>
                                <span>{formatMoney(totals.subtotal)}</span>
                            </div>
                            {totals.discount_total > 0 ? (
                                <div className="flex items-center justify-between text-sm text-emerald-700">
                                    <span>İndirim</span>
                                    <span>{formatMoney(-totals.discount_total)}</span>
                                </div>
                            ) : null}
                            <div className="flex items-center justify-between text-sm">
                                <span>Kargo</span>
                                <span>{formatMoney(totals.shipping_total)}</span>
                            </div>
                            <div className="my-2 h-px bg-border" />
                            <div className="flex items-center justify-between text-base font-semibold">
                                <span>Genel Toplam</span>
                                <span>{formatMoney(totals.grand_total)}</span>
                            </div>

                            <Link
                                href={apiEndpoints.checkoutPage}
                                className="mt-3 inline-flex w-full items-center justify-center rounded bg-black px-4 py-2 text-sm font-medium text-white"
                            >
                                Devam Et
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
