import StorefrontLayout from '@/layouts/storefront/storefront-layout';
import { HeroSection } from './components/HeroSection';
import { BrandsSection } from './components/BrandsSection';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductGrid } from './components/ProductGrid';
import { FeatureBlock } from './components/FeatureBlock';
import { TestimonialSection } from './components/TestimonialSection';

type HomePageProps = {
    apiEndpoints: {
        categories: string;
        products: string;
        brands: string;
    };
};

export default function HomePage({ apiEndpoints }: HomePageProps) {
    return (
        <StorefrontLayout title="Home">
            <div className="w-full">
                {/* Hero Section */}
                <HeroSection />

                {/* Brands Section */}
                <BrandsSection endpoint={apiEndpoints.brands} />

                {/* Categories Section */}
                <CategoryGrid endpoint={apiEndpoints.categories} />

                {/* Featured Products Section */}
                <ProductGrid endpoint={apiEndpoints.products} />
            </div>
        </StorefrontLayout>
    );
}
