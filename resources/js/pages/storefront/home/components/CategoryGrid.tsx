import { CategoryCard } from './CategoryCard';
import storefront from '@/routes/storefront';

type Category = {
    id: number;
    name: string;
    slug: string;
    image?: string;
};

type CategoryGridProps = {
    categories: Category[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
    // Show only first 4 categories
    const displayCategories = categories.slice(0, 4);

    return (
        <section className="mx-auto w-full max-w-[1440px] px-6 py-20 lg:px-12">
            <div className="mb-10 text-center">
                <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#ec135b]">
                    Explore
                </span>
                <h2 className="font-display mb-4 text-3xl font-bold tracking-tight text-[#181113] dark:text-[#f4f0f2] md:text-5xl">
                    Shop by Category
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                    Discover our curated collections of clean beauty essentials
                </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-12 dark:border-white/5 dark:bg-white/5">
                <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
                    {displayCategories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            name={category.name}
                            slug={category.slug}
                            image={category.image}
                            href={storefront.categories.show.url({
                                category: category.slug,
                            })}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
