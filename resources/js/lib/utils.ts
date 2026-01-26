import type { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function formatPrice(price: number | string | null | undefined): string {
    const numPrice = parsePrice(price);
    return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(numPrice);
}

export function parsePrice(price: number | string | null | undefined): number {
    if (price === null || price === undefined) return 0;
    const parsed = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(parsed) ? 0 : parsed;
}

export function calculateDiscountPercent(price: number | string | null | undefined, salePrice: number | string | null | undefined): number {
    const p = parsePrice(price);
    const s = parsePrice(salePrice);
    if (s <= 0 || s >= p) return 0;
    return Math.round(((p - s) / p) * 100);
}
