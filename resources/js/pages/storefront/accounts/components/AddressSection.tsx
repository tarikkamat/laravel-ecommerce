import { useState, type FormEvent } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { AddressCard } from './AddressCard';
import { EmptyAddressState } from './EmptyAddressState';
import type { Address as AddressType } from '@/types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
    const [editingAddress, setEditingAddress] = useState<AddressType | null>(null);
    const [deletingAddress, setDeletingAddress] = useState<AddressType | null>(null);
    const { data, setData, post, put, processing, reset, errors } = useForm({
        type,
        contact_name: '',
        address: '',
        city: '',
        country: 'TR',
        zip_code: '',
    });

    const openAddDialog = () => {
        setEditingAddress(null);
        setData({ type, contact_name: '', address: '', city: '', country: 'TR', zip_code: '' });
        setIsOpen(true);
    };

    const openEditDialog = (address: AddressType) => {
        setEditingAddress(address);
        setData({
            type: address.type as 'billing' | 'shipping',
            contact_name: address.contact_name ?? '',
            address: address.address,
            city: address.city ?? '',
            country: address.country ?? 'TR',
            zip_code: address.zip_code ?? '',
        });
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
        setEditingAddress(null);
        reset();
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (editingAddress) {
            put(`/hesabim/adres/${editingAddress.id}`, {
                preserveScroll: true,
                onSuccess: closeDialog,
            });
        } else {
            post('/hesabim/adres', {
                preserveScroll: true,
                onSuccess: closeDialog,
            });
        }
    };

    const handleDelete = (address: AddressType) => {
        setDeletingAddress(address);
    };

    const confirmDelete = () => {
        if (deletingAddress) {
            router.delete(`/hesabim/adres/${deletingAddress.id}`, {
                preserveScroll: true,
            });
            setDeletingAddress(null);
        }
    };

    const dialogTitle =
        editingAddress
            ? type === 'shipping'
                ? 'Teslimat Adresini Düzenle'
                : 'Fatura Adresini Düzenle'
            : type === 'shipping'
              ? 'Teslimat Adresi Ekle'
              : 'Fatura Adresi Ekle';

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">{title}</h3>
                <button
                    type="button"
                    onClick={openAddDialog}
                    className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#ec135b] hover:opacity-80 transition-opacity"
                >
                    <Plus className="h-3 w-3" />
                    Yeni Ekle
                </button>
            </div>

            {addresses.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {addresses.map((address) => (
                        <AddressCard
                            key={address.id}
                            address={address}
                            onEdit={openEditDialog}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <EmptyAddressState type={type} />
            )}

            <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
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
                            <Button type="button" variant="outline" onClick={closeDialog}>
                                Vazgeç
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {editingAddress ? 'Güncelle' : 'Kaydet'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deletingAddress} onOpenChange={(open) => !open && setDeletingAddress(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Adresi sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu adresi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Sil
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
