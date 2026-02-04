import StorefrontLayout from '@/layouts/storefront/storefront-layout';

type PageShowProps = {
    page: {
        id: number;
        title: string;
        slug: string;
        type: 'contract' | 'flat' | 'contact';
        content: string | null;
        contact_email: string | null;
        contact_phone: string | null;
        contact_address: string | null;
    };
};

export default function PageShow({ page }: PageShowProps) {
    return (
        <StorefrontLayout title={page.title}>
            <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10">
                <div>
                    <h1 className="text-3xl font-bold">{page.title}</h1>
                    {page.type === 'contract' ? (
                        <p className="mt-2 text-sm text-muted-foreground">Sözleşme metni</p>
                    ) : null}
                    {page.type === 'contact' ? (
                        <p className="mt-2 text-sm text-muted-foreground">İletişim bilgileri</p>
                    ) : null}
                </div>

                {page.type === 'contact' ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded border p-4 text-sm">
                            <div className="font-semibold">E-posta</div>
                            <div className="text-muted-foreground">{page.contact_email || '-'}</div>
                        </div>
                        <div className="rounded border p-4 text-sm">
                            <div className="font-semibold">Telefon</div>
                            <div className="text-muted-foreground">{page.contact_phone || '-'}</div>
                        </div>
                        <div className="rounded border p-4 text-sm sm:col-span-2">
                            <div className="font-semibold">Adres</div>
                            <div className="text-muted-foreground whitespace-pre-line">
                                {page.contact_address || '-'}
                            </div>
                        </div>
                    </div>
                ) : null}

                {page.content ? (
                    <div
                        className="prose prose-sm max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                ) : (
                    <div className="rounded border p-6 text-sm text-muted-foreground">
                        Bu sayfa için içerik girilmemiş.
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
