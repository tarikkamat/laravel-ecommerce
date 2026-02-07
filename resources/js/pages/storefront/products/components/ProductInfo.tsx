import { formatPrice, parsePrice, calculateDiscountPercent } from '@/lib/utils';
import type { Product } from '@/types/product';
import { Link, router } from '@inertiajs/react';
import brands from '@/routes/storefront/brands';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

type ProductInfoProps = {
    product: Product;
};

export function ProductInfo({ product }: ProductInfoProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const price = parsePrice(product.price);
    const salePrice = product.sale_price ? parsePrice(product.sale_price) : null;
    const hasDiscount = salePrice !== null && salePrice > 0 && salePrice < price;
    const discountRate = calculateDiscountPercent(price, salePrice);

    const formatDate = (value: string): string => {
        const normalized = value.slice(0, 10);
        const parts = normalized.split('-').map((part) => Number(part));
        if (parts.length === 3 && parts.every((part) => Number.isFinite(part))) {
            const [day, month, year] = parts;
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        }
        return normalized || value;
    };

    const getCsrfToken = (): string => {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta?.getAttribute('content') ?? '';
    };

    const handleAddToCart = async () => {
        if (isAdding || product.stock <= 0) return;

        setIsAdding(true);
        setAdded(false);

        try {
            const response = await fetch('/api/cart/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    product_id: product.id,
                    qty: 1,
                }),
            });

            if (!response.ok) {
                return;
            }

            setAdded(true);
            router.reload({ only: ['cartSummary'] });
        } catch (error) {
            console.error('Add to cart failed:', error);
        } finally {
            setIsAdding(false);
            window.setTimeout(() => setAdded(false), 1200);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    {product.brand && (
                        <Link
                            href={brands.products(product.brand.slug).url}
                            className="text-sm font-semibold text-primary hover:underline"
                        >
                            {product.brand.title}
                        </Link>
                    )}
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm" className="rounded-full">
                            <Share2 className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="rounded-full">
                            <Heart className="size-4" />
                        </Button>
                    </div>
                </div>

                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">
                        {product.title}
                    </h1>
                    {product.sku && (
                        <p className="text-xs text-muted-foreground">
                            SKU: <span className="font-medium">{product.sku}</span>
                        </p>
                    )}
                    {product.skt && (
                        <p className="text-xs text-muted-foreground">
                            SKT: <span className="font-medium">{formatDate(product.skt)}</span>
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {hasDiscount ? (
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-foreground md:text-3xl">
                                {formatPrice(salePrice)} TL
                            </span>
                            <span className="text-base text-muted-foreground line-through">
                                {formatPrice(price)} TL
                            </span>
                            <Badge variant="destructive" className="ml-1">
                                -%{discountRate}
                            </Badge>
                        </div>
                    ) : (
                        <span className="text-2xl font-bold text-foreground md:text-3xl">
                            {formatPrice(price)} TL
                        </span>
                    )}
                </div>

                <Separator className="my-6" />

                {product.description && (
                    <div
                        className="prose prose-sm max-w-none text-muted-foreground line-clamp-4"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                )}
            </div>

            <div className="mt-auto pt-8 space-y-3">
                <div className="flex gap-3">
                    <Button
                        size="lg"
                        className="flex-1 rounded-full text-base font-bold"
                        disabled={product.stock <= 0 || isAdding}
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="mr-2 size-5" />
                        {product.stock <= 0 ? 'Tükendi' : added ? 'Eklendi' : isAdding ? 'Ekleniyor' : 'Sepete Ekle'}
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-full px-4">
                        <Heart className="size-5" />
                    </Button>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                    Güvenli ödeme ve 14 gün içinde kolay iade.
                </p>
            </div>
        </div>
    );
}
