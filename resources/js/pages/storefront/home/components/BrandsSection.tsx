import storefront from '@/routes/storefront';
import { BrandLogo } from './BrandLogo';

type Brand = {
    id: number;
    title: string;
    slug: string;
    image?: {
        path: string;
    };
};

interface BrandsSectionProps {
    brands: Brand[];
}

export function BrandsSection({ brands = [] }: BrandsSectionProps) {
    if (brands.length === 0) return null;

    return (
        <section className="w-full py-12">
            <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                {/* Brands Grid */}
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                    {brands.map((brand) => (
                        <BrandLogo
                            key={brand.id}
                            name={brand.title}
                            href={storefront.brands.show.url({ marka: brand.slug })}
                            imagePath={brand.image?.path}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
