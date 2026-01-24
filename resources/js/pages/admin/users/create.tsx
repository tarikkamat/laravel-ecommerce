import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import { CardContent, CardHeader } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loading-button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem, RoleOption, UserFormData } from '@/types';

interface Props {
    roles: RoleOption[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: admin.dashboard.index(),
    },
    {
        title: 'Kullanıcılar',
        href: admin.users.index().url,
    },
    {
        title: 'Yeni Kullanıcı',
        href: admin.users.create().url,
    },
];

export default function UsersCreate({ roles }: Props) {
    const { data, setData, post, processing, errors } = useForm<UserFormData>({
        name: '',
        email: '',
        password: '',
        role: 'customer',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(admin.users.store().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Yeni Kullanıcı Oluştur" />

            <div className="flex w-full flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Yeni Kullanıcı Oluştur</h1>
                            <p className="text-muted-foreground">
                                Sisteme yeni bir kullanıcı ekleyin.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href={admin.users.index().url}>Vazgeç</Link>
                        </Button>
                        <LoadingButton onClick={submit} loading={processing}>
                            Kaydet
                        </LoadingButton>
                    </div>
                </div>

                <Separator />

                {/* Form */}
                <form onSubmit={submit} className="max-w-2xl">
                    <CardHeader className="pb-0 px-0">
                        <h2 className="text-lg font-semibold">Kullanıcı Bilgileri</h2>
                        <p className="text-sm text-muted-foreground">
                            Kullanıcının temel bilgilerini girin.
                        </p>
                    </CardHeader>
                    <CardContent className="pt-6 px-0 space-y-5">
                        <Field>
                            <FieldLabel htmlFor="name">Ad Soyad</FieldLabel>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                autoFocus
                                aria-invalid={!!errors.name}
                            />
                            <FieldError>{errors.name}</FieldError>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="email">E-posta Adresi</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                aria-invalid={!!errors.email}
                            />
                            <FieldError>{errors.email}</FieldError>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">Şifre</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                aria-invalid={!!errors.password}
                            />
                            <FieldError>{errors.password}</FieldError>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="role">Rol</FieldLabel>
                            <Select
                                value={data.role}
                                onValueChange={(value) => setData('role', value as UserFormData['role'])}
                            >
                                <SelectTrigger id="role" aria-invalid={!!errors.role}>
                                    <SelectValue placeholder="Rol seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.value} value={role.value}>
                                            {role.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FieldError>{errors.role}</FieldError>
                        </Field>
                    </CardContent>
                </form>
            </div>
        </AppLayout>
    );
}
