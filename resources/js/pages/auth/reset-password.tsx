import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { update } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <AuthLayout
            title="Şifreyi Sıfırla"
            description="Lütfen yeni şifrenizi aşağıya girin"
        >
            <Head title="Şifreyi Sıfırla" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                E-posta Adresi
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                className="h-11 rounded-xl border-gray-100 bg-gray-50 px-4 text-sm dark:border-gray-800 dark:bg-gray-900"
                                readOnly
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Yeni Şifre
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                autoFocus
                                placeholder="••••••••"
                                className="h-11 rounded-xl border-gray-100 bg-white px-4 text-sm transition-all focus:border-[#ec135b] focus:ring-[#ec135b]/10 dark:border-gray-800 dark:bg-gray-950"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password_confirmation" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Şifre Tekrarı
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                className="h-11 rounded-xl border-gray-100 bg-white px-4 text-sm transition-all focus:border-[#ec135b] focus:ring-[#ec135b]/10 dark:border-gray-800 dark:bg-gray-950"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button
                            type="submit"
                            className="h-11 w-full rounded-xl bg-gray-900 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                            disabled={processing}
                        >
                            {processing ? <Spinner className="mr-2" /> : null}
                            Şifreyi Sıfırla
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
