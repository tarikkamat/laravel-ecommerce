import { CategoryCard } from './CategoryCard';
import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useIntersectionOnce } from '@/hooks/use-intersection-once';
import storefront from '@/routes/storefront';

type Category = {
    id: number;
    name: string;
    slug: string;
    image?: string;
};

type CategoryGridProps = {
    endpoint: string;
};

export function CategoryGrid({ endpoint }: CategoryGridProps) {
    const [categories, setCategories] = useState<Category[]>([]);
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
                    setCategories(data);
                }
            })
            .catch((error) => {
                if (error.name === 'AbortError') {
                    hasRequestedRef.current = false;
                    return;
                }
                console.error('Failed to fetch categories:', error);
            })
            .finally(() => setIsLoading(false));

        return () => controller.abort();
    }, [isVisible, endpoint]);

    const displayCategories = categories.slice(0, 4);

    return (
        <section
            ref={ref}
            className="mx-auto w-full max-w-[1440px] px-6 py-20 lg:px-12"
        >
            <div className="mb-10 text-center">
                <h2 className="font-display text-2xl font-black tracking-tight text-[#181113] dark:text-[#f4f0f2] md:text-4xl">
                    Popüler Kategoriler
                </h2>
            </div>
            <div className="grid grid-cols-4 gap-6 md:grid-cols-4 lg:grid-cols-8">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={`category-skeleton-${index}`}
                            className="flex flex-col items-center gap-3 text-center"
                        >
                            <Skeleton className="aspect-square w-full rounded-full" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    ))
                    : displayCategories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            name={category.name}
                            slug={category.slug}
                            image={category.image}
                            href={storefront.categories.products.url(category.slug)}
                        />
                    ))}
            </div>
        </section>
    );
}
