import StorefrontLayout from '@/layouts/storefront/storefront-layout';
import { HeroSection } from './components/HeroSection';
import { BrandsSection } from './components/BrandsSection';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductGrid } from './components/ProductGrid';
import { useEffect, useRef, useState } from 'react';

type Brand = {
    id: number;
    title: string;
    slug: string;
};

type HomePageProps = {
    apiEndpoints: {
        categories: string;
        products: string;
        brands: string;
        brandProducts: string;
    };
};

export default function HomePage({ apiEndpoints }: HomePageProps) {
    const [brands, setBrands] = useState<Brand[]>([]);
    const hasRequestedRef = useRef(false);

    useEffect(() => {
        if (hasRequestedRef.current) return;
        hasRequestedRef.current = true;

        fetch(apiEndpoints.brands)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setBrands(data);
                }
            })
            .catch((error) => {
                console.error('Failed to fetch brands:', error);
            });
    }, [apiEndpoints.brands]);

    return (
        <StorefrontLayout title="Home">
            <div className="w-full">
                {/* Hero Section */}
                <HeroSection />

                {/* Brands Section */}
                <BrandsSection endpoint={apiEndpoints.brands} />

                {/* Categories Section
                <CategoryGrid endpoint={apiEndpoints.categories} /> */}

                {/* Brand Product Grids */}
                {brands.map((brand) => (
                    <ProductGrid
                        key={brand.id}
                        title={`${brand.title} Ürünleri`}
                        subtitle={brand.title}
                        endpoint={apiEndpoints.brandProducts.replace(':brandId', String(brand.id))}
                    />
                ))}
            </div>
        </StorefrontLayout>
    );
}
