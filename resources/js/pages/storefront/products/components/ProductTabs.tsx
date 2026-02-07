import type { Product } from '@/types/product';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Info, FileText, Beaker, Zap } from 'lucide-react';

type ProductTabsProps = {
    product: Product;
};

export function ProductTabs({ product }: ProductTabsProps) {
    return (
        <Tabs defaultValue="description" className="w-full">
            <TabsList variant="line" className="w-full justify-start border-b rounded-none h-auto p-0 gap-8">
                <TabsTrigger
                    value="description"
                    className="data-[state=active]:bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-1 py-4 text-sm font-semibold transition-all"
                >
                    <FileText className="mr-2 size-4" />
                    Ürün Açıklaması
                </TabsTrigger>
                <TabsTrigger
                    value="ingredients"
                    className="data-[state=active]:bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-1 py-4 text-sm font-semibold transition-all"
                >
                    <Beaker className="mr-2 size-4" />
                    İçerik ve Detaylar
                </TabsTrigger>
            </TabsList>

            <div className="py-8">
                <TabsContent value="description" className="mt-0">
                    <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                        {product.description ? (
                            <div dangerouslySetInnerHTML={{ __html: product.description }} />
                        ) : (
                            <div className="flex items-center gap-2 text-muted-foreground italic">
                                <Info className="size-4" />
                                Bu ürün için henüz detaylı açıklama girilmemiş.
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="ingredients" className="mt-0">
                    <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold flex items-center gap-2">
                                    <Beaker className="size-4 text-primary" />
                                    Temel Bileşenler
                                </h4>
                                {product.ingredients && product.ingredients.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {product.ingredients.map((ingredient) => (
                                            <Badge
                                                key={ingredient.id}
                                                variant="secondary"
                                                className="rounded-lg px-3 py-1 text-[11px] font-medium"
                                            >
                                                {ingredient.title}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">İçerik bilgisi mevcut değil.</p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-bold flex items-center gap-2">
                                    <Info className="size-4 text-primary" />
                                    Ek Bilgiler
                                </h4>
                                <ul className="text-sm text-muted-foreground space-y-2">
                                    <li className="flex items-center gap-2">
                                        <div className="size-1 rounded-full bg-border" />
                                        Dermatolojik olarak test edilmiştir.
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="size-1 rounded-full bg-border" />
                                        Hayvanlar üzerinde deney yapılmamıştır.
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="size-1 rounded-full bg-border" />
                                        %100 Vegan içerik.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </div>
        </Tabs>
    );
}
