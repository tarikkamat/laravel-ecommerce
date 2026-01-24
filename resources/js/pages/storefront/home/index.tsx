import StorefrontLayout from '@/layouts/storefront/storefront-layout';
import { HeroSection } from './components/HeroSection';
import { BrandsSection } from './components/BrandsSection';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductGrid } from './components/ProductGrid';
import { FeatureBlock } from './components/FeatureBlock';
import { TestimonialSection } from './components/TestimonialSection';

type Category = {
    id: number;
    name: string;
    slug: string;
    image?: string;
};

type Product = {
    id: number;
    name: string;
    slug: string;
    price: string | number;
    description?: string;
    image?: string;
};

type Brand = {
    id: number;
    title: string;
    slug: string;
    image?: {
        path: string;
    };
};

type HomePageProps = {
    categories: Category[];
    featuredProducts: Product[];
    brands: Brand[];
};

export default function HomePage({
    categories = [],
    featuredProducts = [],
    brands = [],
}: HomePageProps) {
    return (
        <StorefrontLayout title="Home">
            <div className="w-full">
                {/* Hero Section */}
                <HeroSection />

                {/* Brands Section */}
                <BrandsSection brands={brands} />

                {/* Feature Block */}
                <FeatureBlock />

                {/* Testimonial Section */}
                <TestimonialSection />
            </div>
        </StorefrontLayout>
    );
}
