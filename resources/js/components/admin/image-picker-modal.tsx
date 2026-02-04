import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { ImageModel, PaginatedData } from '@/types';

const DEFAULT_PER_PAGE = 24;
const PAGE_SIZES = [12, 24, 48, 96];

type ImagePickerModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (imageUrl: string, image: ImageModel) => void;
};

type FetchState = {
    data: PaginatedData<ImageModel> | null;
    isLoading: boolean;
    error: string | null;
};

export function ImagePickerModal({ open, onOpenChange, onSelect }: ImagePickerModalProps) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [order, setOrder] = useState<'newest' | 'oldest'>('newest');
    const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
    const [{ data, isLoading, error }, setFetchState] = useState<FetchState>({
        data: null,
        isLoading: false,
        error: null,
    });

    const canGoPrev = useMemo(() => (data?.current_page ?? 1) > 1, [data]);
    const canGoNext = useMemo(() => (data?.current_page ?? 1) < (data?.last_page ?? 1), [data]);

    useEffect(() => {
        if (!open) {
            setFetchState((prev) => ({ ...prev, error: null }));
            return;
        }

        setPage(1);
    }, [open]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (!open) return;
        setPage(1);
    }, [order, open]);

    useEffect(() => {
        if (!open) return;
        setPage(1);
    }, [perPage, open]);

    useEffect(() => {
        if (!open) return;

        const controller = new AbortController();

        const loadImages = async () => {
            try {
                setFetchState((prev) => ({ ...prev, isLoading: true, error: null }));
                const params = new URLSearchParams({
                    per_page: String(perPage),
                    page: String(page),
                    order,
                });

                if (debouncedSearch) {
                    params.set('search', debouncedSearch);
                }

                const response = await fetch(`/api/admin/images?${params.toString()}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error('Görseller yüklenemedi.');
                }

                const payload = (await response.json()) as PaginatedData<ImageModel>;
                setFetchState({ data: payload, isLoading: false, error: null });
            } catch (fetchError) {
                if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
                    return;
                }

                setFetchState({ data: null, isLoading: false, error: 'Görseller yüklenemedi.' });
            }
        };

        void loadImages();

        return () => controller.abort();
    }, [open, page, debouncedSearch, order, perPage]);

    const handleSelect = (image: ImageModel) => {
        const imageUrl = `/storage/${image.path}`;
        onSelect(imageUrl, image);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Görsel Seç</DialogTitle>
                    <DialogDescription>
                        İçerikte kullanmak istediğiniz görseli seçin.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Görsel ara (başlık, slug, açıklama)"
                        />
                        <div className="flex w-full gap-2 sm:w-auto">
                            <select
                                value={order}
                                onChange={(event) => setOrder(event.target.value as 'newest' | 'oldest')}
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-36"
                            >
                                <option value="newest">En yeni</option>
                                <option value="oldest">En eski</option>
                            </select>
                            <select
                                value={perPage}
                                onChange={(event) => setPerPage(Number(event.target.value))}
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-24"
                            >
                                {PAGE_SIZES.map((size) => (
                                    <option key={size} value={size}>
                                        {size} / sayfa
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {isLoading && <p className="text-sm text-muted-foreground">Görseller yükleniyor...</p>}
                    {error && <p className="text-sm text-destructive">{error}</p>}

                    {!isLoading && !error && data?.data?.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            {debouncedSearch ? 'Aramaya uygun görsel bulunamadı.' : 'Henüz görsel yok.'}
                        </p>
                    )}

                    {!isLoading && !error && data?.data?.length ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {data.data.map((image) => (
                                <button
                                    key={image.id}
                                    type="button"
                                    onClick={() => handleSelect(image)}
                                    className="group overflow-hidden rounded-md border border-input bg-background text-left shadow-sm transition hover:border-primary"
                                >
                                    <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                                        <img
                                            src={`/storage/${image.path}`}
                                            alt={image.title ?? image.slug}
                                            className="h-full w-full object-cover transition group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="px-2 py-1.5">
                                        <p className="truncate text-xs font-medium text-foreground">
                                            {image.title ?? image.slug}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : null}

                    <div className="flex items-center justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            disabled={!canGoPrev || isLoading}
                        >
                            Önceki
                        </Button>
                        <span className="text-xs text-muted-foreground">
                            Sayfa {data?.current_page ?? 1} / {data?.last_page ?? 1}
                        </span>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((prev) => prev + 1)}
                            disabled={!canGoNext || isLoading}
                        >
                            Sonraki
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
