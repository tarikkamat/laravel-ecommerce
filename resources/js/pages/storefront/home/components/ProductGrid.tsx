import { ProductCard } from './ProductCard';
import storefront from '@/routes/storefront';
import { Link } from '@inertiajs/react';

type Product = {
    id: number;
    name: string;
    slug: string;
    price: string | number;
    description?: string;
    image?: string;
};

type ProductGridProps = {
    products: Product[];
    title?: string;
    subtitle?: string;
};

export function ProductGrid({
    products,
    title = 'Featured Products',
    subtitle = 'Trending Now',
}: ProductGridProps) {
    // Show only first 3 products on home page
    const displayProducts = products.slice(0, 3);

    return (
        <section className="mx-auto w-full max-w-[1440px] px-6 py-20 lg:px-12">
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
                    href={storefront.products.index.url()}
                    className="flex items-center gap-1 text-sm font-semibold text-[#ec135b] hover:text-[#ec135b]/80"
                >
                    View all products
                    <span className="material-symbols-outlined text-[16px]">
                        arrow_forward
                    </span>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {displayProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        slug={product.slug}
                        price={product.price}
                        description={product.description}
                        image={product.image}
                        href={storefront.products.show.url({
                            product: product.slug,
                        })}
                        tag={product.id === 1 ? 'New Arrival' : undefined}
                    />
                ))}
            </div>
        </section>
    );
}
