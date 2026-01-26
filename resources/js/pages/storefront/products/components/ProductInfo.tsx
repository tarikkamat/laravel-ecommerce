import { formatPrice, parsePrice, calculateDiscountPercent } from '@/lib/utils';
import type { Product } from '@/types/product';
import { Link } from '@inertiajs/react';
import brands from '@/routes/storefront/brands';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type ProductInfoProps = {
    product: Product;
};

export function ProductInfo({ product }: ProductInfoProps) {
    const price = parsePrice(product.price);
    const salePrice = product.sale_price ? parsePrice(product.sale_price) : null;
    const hasDiscount = salePrice !== null && salePrice > 0 && salePrice < price;
    const discountRate = calculateDiscountPercent(price, salePrice);

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
                </div>

                <div className="flex items-center gap-3">
                    {hasDiscount ? (
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-foreground md:text-3xl">
                                ₺{formatPrice(salePrice)}
                            </span>
                            <span className="text-base text-muted-foreground line-through">
                                ₺{formatPrice(price)}
                            </span>
                            <Badge variant="destructive" className="ml-1">
                                -%{discountRate}
                            </Badge>
                        </div>
                    ) : (
                        <span className="text-2xl font-bold text-foreground md:text-3xl">
                            ₺{formatPrice(price)}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Badge 
                        variant={product.stock > 0 ? "secondary" : "destructive"}
                        className="rounded-full px-2"
                    >
                        {product.stock > 0 ? 'Stokta' : 'Tükendi'}
                    </Badge>
                    {product.stock > 0 && (
                        <span className="text-xs text-muted-foreground">
                            {product.stock} adet mevcut
                        </span>
                    )}
                </div>

                <Separator className="my-6" />

                {product.description && (
                    <div className="prose prose-sm max-w-none text-muted-foreground line-clamp-4">
                        {product.description}
                    </div>
                )}
            </div>

            <div className="mt-auto pt-8 space-y-3">
                <div className="flex gap-3">
                    <Button size="lg" className="flex-1 rounded-full text-base font-bold" disabled={product.stock <= 0}>
                        <ShoppingCart className="mr-2 size-5" />
                        Sepete Ekle
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
