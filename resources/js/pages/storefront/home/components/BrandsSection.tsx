import { useEffect, useRef, useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { Skeleton } from '@/components/ui/skeleton';
import { useIntersectionOnce } from '@/hooks/use-intersection-once';
import brands from '@/routes/storefront/brands';

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
    const [brandsList, setBrandsList] = useState<Brand[]>([]);
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
                    setBrandsList(data);
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
    if (hasFetched && !isLoading && brandsList.length === 0) {
        return null;
    }

    const sliderRef = useRef<HTMLDivElement>(null);

    const scrollByAmount = (direction: 'left' | 'right') => {
        const slider = sliderRef.current;
        if (!slider) return;
        const amount = Math.round(slider.clientWidth * 0.8);
        slider.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    return (
        <section ref={ref} className="w-full overflow-x-hidden py-8 bg-gray-50/30 dark:bg-black/10">
            <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                {/* Brands Slider */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => scrollByAmount('left')}
                        className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 p-2 text-sm font-semibold text-[#181113] shadow-sm transition hover:border-[#ec135b] hover:text-[#ec135b] dark:border-white/10 dark:bg-[#1a0c10]/90 dark:text-[#f4f0f2] md:flex"
                        aria-label="Sola kaydır"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollByAmount('right')}
                        className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 p-2 text-sm font-semibold text-[#181113] shadow-sm transition hover:border-[#ec135b] hover:text-[#ec135b] dark:border-white/10 dark:bg-[#1a0c10]/90 dark:text-[#f4f0f2] md:flex"
                        aria-label="Sağa kaydır"
                    >
                        ›
                    </button>
                    <div
                        ref={sliderRef}
                        className="no-scrollbar flex snap-x snap-mandatory flex-nowrap items-center gap-4 overflow-x-auto px-2 pb-2 scroll-px-2 md:gap-6 md:px-6 md:scroll-px-6"
                    >
                        {isLoading
                            ? Array.from({ length: 10 }).map((_, index) => (
                                  <div key={`brand-skeleton-${index}`} className="snap-start">
                                      <Skeleton className="h-14 w-28 rounded-xl md:h-16 md:w-32" />
                                  </div>
                              ))
                            : brandsList.map((brand) => (
                                  <div key={brand.id} className="snap-start">
                                      <BrandLogo
                                          name={brand.title}
                                          href={brands.products.url(brand.slug)}
                                          imagePath={brand.image?.path}
                                      />
                                  </div>
                              ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
