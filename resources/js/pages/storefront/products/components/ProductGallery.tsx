import { useState } from 'react';
import type { ImageModel } from '@/types/image';
import { cn } from '@/lib/utils';

type ProductGalleryProps = {
    images: ImageModel[];
};

export function ProductGallery({ images }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(images[0] || null);

    if (!images.length) {
        return (
            <div className="aspect-square w-full rounded-2xl bg-muted flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Görsel bulunamadı</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 lg:flex-row-reverse lg:items-start lg:gap-6">
            {/* Main Image */}
            <div className="relative aspect-square flex-1 overflow-hidden rounded-2xl bg-muted ring-1 ring-border shadow-sm">
                <img
                    src={`/storage/${activeImage?.path}`}
                    alt={activeImage?.title || 'Ürün görseli'}
                    className="h-full w-full object-cover object-center transition-all duration-500 hover:scale-105"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0 scrollbar-hide">
                    {images.map((image) => (
                        <button
                            key={image.id}
                            onClick={() => setActiveImage(image)}
                            className={cn(
                                "relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all hover:opacity-80 lg:w-20",
                                activeImage?.id === image.id
                                    ? "border-primary"
                                    : "border-transparent bg-muted"
                            )}
                        >
                            <img
                                src={`/storage/${image.path}`}
                                alt={image.title || 'Küçük görsel'}
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
