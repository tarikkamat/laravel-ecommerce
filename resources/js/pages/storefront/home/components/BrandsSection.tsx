import { useEffect, useRef, useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { Skeleton } from '@/components/ui/skeleton';
import { useIntersectionOnce } from '@/hooks/use-intersection-once';

type Brand = {
    id: number;
    title: string;
    slug: string;
    image?: {
        path: string;
    };
};

type BrandsSectionProps = {
    endpoint: string;
};

export function BrandsSection({ endpoint }: BrandsSectionProps) {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false);
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
                    setBrands(data);
                }
                setHasFetched(true);
            })
            .catch((error) => {
                if (error.name === 'AbortError') {
                    hasRequestedRef.current = false;
                    return;
                }
                console.error('Failed to fetch brands:', error);
                setHasFetched(true);
            })
            .finally(() => setIsLoading(false));

        return () => controller.abort();
    }, [isVisible, endpoint]);

    // Hide section only after fetch completed and no data
    if (hasFetched && !isLoading && brands.length === 0) {
        return null;
    }

    return (
        <section ref={ref} className="w-full py-12">
            <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                {/* Brands Grid */}
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                    {isLoading
                        ? Array.from({ length: 8 }).map((_, index) => (
                              <Skeleton
                                  key={`brand-skeleton-${index}`}
                                  className="h-14 w-28 rounded-lg md:h-16 md:w-32"
                              />
                          ))
                        : brands.map((brand) => (
                              <BrandLogo
                                  key={brand.id}
                                  name={brand.title}
                                  href="#"
                                  imagePath={brand.image?.path}
                              />
                          ))}
                </div>
            </div>
        </section>
    );
}
