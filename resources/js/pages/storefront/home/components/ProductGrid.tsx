import { ProductCard } from './ProductCard';
import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useIntersectionOnce } from '@/hooks/use-intersection-once';

type Product = {
    id: number;
    name: string;
    slug: string;
    price: string | number;
    description?: string;
    image?: string;
};

type ProductGridProps = {
    endpoint: string;
    title?: string;
    subtitle?: string;
};

export function ProductGrid({
    endpoint,
    title = 'Featured Products',
    subtitle = 'Trending Now',
}: ProductGridProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const hasRequestedRef = useRef(false);
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
            })
            .catch((error) => {
                if (error.name === 'AbortError') {
                    hasRequestedRef.current = false;
                    return;
                }
                console.error('Failed to fetch products:', error);
            })
            .finally(() => setIsLoading(false));

        return () => controller.abort();
    }, [isVisible, endpoint]);

    const displayProducts = products.slice(0, 3);

    return (
        <section
            ref={ref}
            className="mx-auto w-full max-w-[1440px] px-6 py-20 lg:px-12"
        >
            <div className="mb-10 flex items-end justify-between">
                <div>
                    <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#ec135b]">
                        {subtitle}
                    </span>
                    <h2 className="font-display text-3xl font-bold tracking-tight text-[#181113] dark:text-[#f4f0f2] md:text-5xl">
                        {title}
                    </h2>
                </div>
                <Link
                    href="#"
                    className="flex items-center gap-1 text-sm font-semibold text-[#ec135b] hover:text-[#ec135b]/80"
                >
                    View all products
                    <span className="material-symbols-outlined text-[16px]">
                        arrow_forward
                    </span>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {isLoading
                    ? Array.from({ length: 3 }).map((_, index) => (
                          <div
                              key={`product-skeleton-${index}`}
                              className="flex max-w-sm flex-col gap-3"
                          >
                              <Skeleton className="aspect-[4/5] w-full rounded-xl" />
                              <div className="flex items-center justify-between px-1">
                                  <Skeleton className="h-5 w-36" />
                                  <Skeleton className="h-5 w-12" />
                              </div>
                              <Skeleton className="h-4 w-40 px-1" />
                          </div>
                      ))
                    : displayProducts.map((product) => (
                          <ProductCard
                              key={product.id}
                              id={product.id}
                              name={product.name}
                              slug={product.slug}
                              price={product.price}
                              description={product.description}
                              image={product.image}
                              href="#"
                              tag={product.id === 1 ? 'New Arrival' : undefined}
                          />
                      ))}
            </div>
        </section>
    );
}
