import { useState, type FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { AddressCard } from './AddressCard';
import { EmptyAddressState } from './EmptyAddressState';
import type { Address as AddressType } from '@/types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type AddressSectionProps = {
    title: string;
    addresses: AddressType[];
    type: 'billing' | 'shipping';
};

export function AddressSection({
    title,
    addresses,
    type,
}: AddressSectionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        type,
        contact_name: '',
        address: '',
        city: '',
        country: 'TR',
        zip_code: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post('/hesabim/adres', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsOpen(false);
            },
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">{title}</h3>
                <button
                    type="button"
                    onClick={() => {
                        setData('type', type);
                        setIsOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#ec135b] hover:opacity-80 transition-opacity"
                >
                    <Plus className="h-3 w-3" />
                    Yeni Ekle
                </button>
            </div>

            {addresses.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {addresses.map((address) => (
                        <AddressCard key={address.id} address={address} />
                    ))}
                </div>
            ) : (
                <EmptyAddressState type={type} />
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{type === 'shipping' ? 'Teslimat Adresi Ekle' : 'Fatura Adresi Ekle'}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor={`${type}-contact_name`}>Ad Soyad</Label>
                            <Input
                                id={`${type}-contact_name`}
                                value={data.contact_name}
                                onChange={(event) => setData('contact_name', event.target.value)}
                                aria-invalid={!!errors.contact_name}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor={`${type}-address`}>Adres</Label>
                            <Input
                                id={`${type}-address`}
                                value={data.address}
                                onChange={(event) => setData('address', event.target.value)}
                                aria-invalid={!!errors.address}
                                required
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor={`${type}-city`}>Şehir</Label>
                                <Input
                                    id={`${type}-city`}
                                    value={data.city}
                                    onChange={(event) => setData('city', event.target.value)}
                                    aria-invalid={!!errors.city}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`${type}-zip_code`}>Posta Kodu</Label>
                                <Input
                                    id={`${type}-zip_code`}
                                    value={data.zip_code}
                                    onChange={(event) => setData('zip_code', event.target.value)}
                                    aria-invalid={!!errors.zip_code}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor={`${type}-country`}>Ülke Kodu</Label>
                            <Input
                                id={`${type}-country`}
                                value={data.country}
                                onChange={(event) => setData('country', event.target.value.toUpperCase())}
                                aria-invalid={!!errors.country}
                                maxLength={2}
                                required
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                Vazgeç
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Kaydet
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
