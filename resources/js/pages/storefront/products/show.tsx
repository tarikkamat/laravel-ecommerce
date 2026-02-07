import { Link, useForm, usePage } from '@inertiajs/react';
import { type FormEventHandler, useState } from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import StorefrontLayout from '@/layouts/storefront/storefront-layout';
import storefront from '@/routes/storefront';
import type { ProductComment, SharedData } from '@/types';
import type { Product } from '@/types/product';
import { ProductGallery } from './components/ProductGallery';
import { ProductInfo } from './components/ProductInfo';
import { ProductTabs } from './components/ProductTabs';

type ProductShowProps = {
    product: Product;
    comments: ProductComment[];
};

const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export default function ProductShow({ product, comments }: ProductShowProps) {
    const { auth } = usePage<SharedData>().props;
    const [notice, setNotice] = useState<string | null>(null);
    const { data, setData, post, processing, reset, errors } = useForm({ body: '' });
    const commentsEnabled = product.comments_enabled;
    const user = auth.user;

    const submitComment: FormEventHandler = (event) => {
        event.preventDefault();

        post(storefront.products.comments.store(product.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setNotice('Yorumunuz onaydan sonra görünecek.');
            },
        });
    };

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

                {/* Comments Section */}
                <div className="mt-12 md:mt-16 lg:mt-20">
                    <Separator className="mb-8 md:mb-12" />
                    <div className="mx-auto max-w-4xl space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight md:text-2xl">Yorumlar</h2>
                                <p className="text-sm text-muted-foreground">
                                    {comments.length > 0 ? `${comments.length} onaylı yorum` : 'Henüz yorum yok.'}
                                </p>
                            </div>
                        </div>

                        {commentsEnabled ? (
                            user ? (
                                <form onSubmit={submitComment} className="space-y-3 rounded-2xl border bg-muted/20 p-4 md:p-6">
                                    <div>
                                        <label htmlFor="comment-body" className="text-sm font-semibold">
                                            Yorumunuzu Yazın
                                        </label>
                                        <textarea
                                            id="comment-body"
                                            className="mt-2 min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            placeholder="Bu ürün hakkında düşüncelerinizi paylaşın..."
                                            value={data.body}
                                            onChange={(event) => setData('body', event.target.value)}
                                        />
                                        {errors.body && (
                                            <p className="mt-2 text-xs text-destructive">{errors.body}</p>
                                        )}
                                    </div>
                                    {notice && (
                                        <p className="text-xs font-medium text-emerald-600">{notice}</p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground">
                                            Yorumunuz onaydan sonra görünür.
                                        </p>
                                        <Button type="submit" disabled={processing || data.body.trim() === ''}>
                                            Gönder
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="rounded-2xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                                    Yorum yapmak için giriş yapmalısınız.
                                </div>
                            )
                        ) : (
                            <div className="rounded-2xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                                Bu ürün yoruma kapalı.
                            </div>
                        )}

                        {comments.length > 0 && (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="rounded-2xl border bg-white p-4 shadow-sm">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="text-sm font-semibold">
                                                {comment.user?.name || comment.user?.email || 'Müşteri'}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {formatDate(comment.created_at)}
                                            </div>
                                        </div>
                                        <p className="mt-3 text-sm text-muted-foreground">{comment.body}</p>

                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="mt-4 space-y-3 border-l border-muted pl-4">
                                                {comment.replies.map((reply) => (
                                                    <div key={reply.id} className="rounded-xl bg-muted/30 p-3">
                                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                            <span>Yönetici</span>
                                                            <span>{formatDate(reply.created_at)}</span>
                                                        </div>
                                                        <p className="mt-2 text-sm text-foreground">{reply.body}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
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
