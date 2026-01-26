import { StorefrontProductCard } from '@/components/storefront-product-card';
import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useIntersectionOnce } from '@/hooks/use-intersection-once';
import type { Product } from '@/types/product';

type ProductGridProps = {
    endpoint: string;
    title?: string;
    subtitle?: string;
};

export function ProductGrid({
    endpoint,
    title = 'Öne Çıkan Ürünler',
    subtitle = 'Senin İçin Seçtiklerimiz',
}: ProductGridProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false);
    const hasRequestedRef = useRef(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { ref, isVisible } = useIntersectionOnce<HTMLElement>({
        rootMargin: '200px 0px',
        threshold: 0,
    });

    useEffect(() => {
        if (!isVisible) return;
        if (hasRequestedRef.current) return;
        hasRequestedRef.current = true;

        const controller = new AbortController();
        fetch(endpoint, { signal: controller.signal })
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProducts(data);
                }
                setHasFetched(true);
            })
            .catch((error) => {
                if (error.name === 'AbortError') {
                    hasRequestedRef.current = false;
                    return;
                }
                console.error('Failed to fetch products:', error);
                setHasFetched(true);
            })
            .finally(() => setIsLoading(false));

        return () => controller.abort();
    }, [isVisible, endpoint]);

    // Hide section if fetch completed and no products
    if (hasFetched && !isLoading && products.length === 0) {
        return null;
    }

    const displayProducts = products.slice(0, 10);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.offsetWidth * 0.8;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section
            ref={ref}
            className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-12 lg:px-12"
        >
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-[#ec135b]">
                        {subtitle}
                    </span>
                    <h2 className="font-display text-2xl font-black tracking-tight text-[#181113] dark:text-[#f4f0f2] md:text-4xl">
                        {title}
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => scroll('left')}
                        className="flex size-11 items-center justify-center rounded-full border border-gray-100 bg-white text-[#181113] shadow-xs transition-all hover:border-[#ec135b]/20 hover:text-[#ec135b] dark:border-white/5 dark:bg-[#181113] dark:text-[#f4f0f2]"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            arrow_back
                        </span>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="flex size-11 items-center justify-center rounded-full border border-gray-100 bg-white text-[#181113] shadow-xs transition-all hover:border-[#ec135b]/20 hover:text-[#ec135b] dark:border-white/5 dark:bg-[#181113] dark:text-[#f4f0f2]"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            arrow_forward
                        </span>
                    </button>
                    <Link
                        href="#"
                        className="ml-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ec135b] hover:opacity-80 transition-opacity"
                    >
                        Tümünü Gör
                        <span className="material-symbols-outlined text-[16px]">
                            trending_flat
                        </span>
                    </Link>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scroll-smooth pb-8 scrollbar-hide md:gap-6"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {isLoading
                    ? Array.from({ length: 5 }).map((_, index) => (
                          <div
                              key={`product-skeleton-${index}`}
                              className="w-[calc((100%-48px)/2.5)] sm:w-[calc((100%-96px)/4.5)] lg:w-[calc((100%-120px)/5.5)] flex-shrink-0 flex-col gap-4"
                          >
                              <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
                              <div className="mt-2 flex flex-col gap-2 px-1">
                                  <Skeleton className="h-3 w-16" />
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-20" />
                              </div>
                          </div>
                      ))
                    : displayProducts.map((product) => (
                          <div
                              key={product.id}
                              className="w-[calc((100%-48px)/2.5)] sm:w-[calc((100%-96px)/4.5)] lg:w-[calc((100%-120px)/5.5)] flex-shrink-0"
                          >
                              <StorefrontProductCard product={product} />
                          </div>
                      ))}
            </div>
        </section>
    );
}
