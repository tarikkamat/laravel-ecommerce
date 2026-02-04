import { Link, router } from '@inertiajs/react';
import type { Product } from '@/types/product';
import { formatPrice, parsePrice, calculateDiscountPercent } from '@/lib/utils';
import { useState } from 'react';

type StorefrontProductCardProps = {
    product: Product;
};

export function StorefrontProductCard({ product }: StorefrontProductCardProps) {
    const productImage = product.images && product.images.length > 0 ? `/storage/${product.images[0].path}` : undefined;
    const [isAdding, setIsAdding] = useState(false);
    const [added, setAdded] = useState(false);

    const price = parsePrice(product.price);
    const salePrice = product.sale_price ? parsePrice(product.sale_price) : null;
    const hasDiscount = salePrice !== null && salePrice < price;
    const discountPercent = calculateDiscountPercent(price, salePrice);

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
        <div className="product-card group relative flex flex-col gap-4">
            <Link href={`/urunler/${product.slug}`} className="block overflow-hidden rounded-2xl">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 dark:bg-white/5">
                    {/* Background Overlay on Hover */}
                    <div className="absolute inset-0 z-10 bg-black/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Badges */}
                    <div className="absolute left-3 top-3 z-20 flex flex-col gap-2">
                        {hasDiscount && (
                            <span className="flex h-6 items-center rounded-full bg-[#ec135b] px-2.5 text-[10px] font-black uppercase tracking-wider text-white shadow-lg shadow-[#ec135b]/20">
                                -%{discountPercent}
                            </span>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                            <span className="flex h-6 items-center rounded-full bg-[#181113] px-2.5 text-[10px] font-black uppercase tracking-wider text-white dark:bg-[#f4f0f2] dark:text-[#181113]">
                                Son {product.stock} Ürün
                            </span>
                        )}
                    </div>

                    {/* Product Image */}
                    <img
                        alt={product.title}
                        className="product-img h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        src={productImage}
                    />

                    {/* Quick Add Button */}
                    <div className="absolute bottom-4 left-0 right-0 z-20 px-4 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart();
                            }}
                            disabled={isAdding || product.stock <= 0}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-black uppercase tracking-widest text-[#181113] shadow-xl hover:bg-[#181113] hover:text-white transition-colors dark:bg-[#181113] dark:text-[#f4f0f2] dark:hover:bg-[#f4f0f2] dark:hover:text-[#181113]"
                        >
                            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                            {product.stock <= 0 ? 'Tükendi' : added ? 'Eklendi' : isAdding ? 'Ekleniyor' : 'Sepete Ekle'}
                        </button>
                    </div>
                </div>
            </Link>

            {/* Product Info */}
            <div className="flex flex-col gap-2 px-1">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        {product.brand && (
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ec135b]">
                                {product.brand.title}
                            </span>
                        )}
                        <Link href={`/urunler/${product.slug}`}>
                            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#181113] hover:text-[#ec135b] transition-colors dark:text-[#f4f0f2]">
                                {product.title}
                            </h3>
                        </Link>
                    </div>
                </div>

                {/* Price Display */}
                <div className="flex items-center gap-3">
                    {hasDiscount ? (
                        <>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 line-through">
                                    ₺{formatPrice(price)}
                                </span>
                                <span className="text-base font-black text-[#ec135b]">
                                    ₺{formatPrice(salePrice)}
                                </span>
                            </div>
                        </>
                    ) : (
                        <span className="text-base font-black text-[#181113] dark:text-[#f4f0f2]">
                            ₺{formatPrice(price)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
