import StorefrontLayout from '@/layouts/storefront/storefront-layout';
import type { Product } from '@/types/product';
import { ProductGallery } from './components/ProductGallery';
import { ProductInfo } from './components/ProductInfo';
import { ProductTabs } from './components/ProductTabs';
import { Link } from '@inertiajs/react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

type ProductShowProps = {
    product: Product;
};

export default function ProductShow({ product }: ProductShowProps) {
    console.log(product);
    return (
        <StorefrontLayout title={product.title}>
            <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:py-10">
                {/* Breadcrumbs */}
                <Breadcrumb className="mb-6 md:mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/">Anasayfa</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/urunler">Ürünler</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="max-w-[200px] truncate">
                                {product.title}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                    {/* Left: Gallery */}
                    <div className="lg:col-span-7">
                        <ProductGallery images={product.images || []} />
                    </div>

                    {/* Right: Info */}
                    <div className="lg:col-span-5">
                        <ProductInfo product={product} />
                    </div>
                </div>

                {/* Bottom: Tabs & Detailed Info */}
                <div className="mt-12 md:mt-16 lg:mt-20">
                    <Separator className="mb-8 md:mb-12" />
                    <div className="mx-auto max-w-4xl">
                        <ProductTabs product={product} />
                    </div>
                </div>

                {/* Related Products Section */}
                <div className="mt-16 md:mt-24">
                    <div className="mb-8 flex items-end justify-between">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold tracking-tight md:text-2xl">
                                Bunları da Beğenebilirsiniz
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Sizin için seçtiğimiz benzer ürünlere göz atın.
                            </p>
                        </div>
                        <Link
                            href="/urunler"
                            className="text-sm font-medium text-primary hover:underline underline-offset-4"
                        >
                            Tümünü Gör
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                        <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 px-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                İlginizi çekebilecek diğer ürünler yakında burada listelenecek.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </StorefrontLayout>
    );
}
