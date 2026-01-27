import { Link, router } from '@inertiajs/react';
import type { Category, PaginatedData } from '@/types';
import { CategoryCard } from './CategoryCard';

type CategoriesGridProps = {
    categories: PaginatedData<Category>;
};

export function CategoriesGrid({ categories }: CategoriesGridProps) {
    const handlePageChange = (url: string | null) => {
        if (!url) return;
        router.visit(url, { preserveScroll: true });
    };

    if (categories.data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 py-20 dark:bg-gray-800/50">
                <span className="material-symbols-outlined mb-4 text-[64px] text-gray-300 dark:text-gray-600">
                    category
                </span>
                <h3 className="mb-2 text-xl font-bold text-[#181113] dark:text-[#f4f0f2]">
                    Henüz kategori bulunmuyor
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Yakında yeni kategoriler eklenecek.
                </p>
                <Link
                    href="/"
                    className="mt-6 rounded-lg bg-[#ec135b] px-6 py-3 font-bold text-white hover:bg-[#ec135b]/90"
                >
                    Ana Sayfaya Dön
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Results Count */}
            <div className="mb-8">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-[#181113] dark:text-[#f4f0f2]">
                        {categories.total}
                    </span>{' '}
                    kategori bulundu
                </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-6">
                {categories.data.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>

            {/* Pagination */}
            {categories.last_page > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                    {/* Previous Button */}
                    <button
                        onClick={() =>
                            handlePageChange(
                                categories.current_page > 1
                                    ? `/kategoriler?page=${categories.current_page - 1}`
                                    : null
                            )
                        }
                        disabled={categories.current_page === 1}
                        className="flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-[#ec135b] disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            chevron_left
                        </span>
                    </button>

                    {/* Page Numbers */}
                    {categories.links.slice(1, -1).map((link, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(link.url)}
                            disabled={link.active || !link.url}
                            className={`flex size-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                                link.active
                                    ? 'bg-[#ec135b] text-white'
                                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-[#ec135b] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}

                    {/* Next Button */}
                    <button
                        onClick={() =>
                            handlePageChange(
                                categories.current_page < categories.last_page
                                    ? `/kategoriler?page=${categories.current_page + 1}`
                                    : null
                            )
                        }
                        disabled={categories.current_page === categories.last_page}
                        className="flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-[#ec135b] disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            chevron_right
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}
