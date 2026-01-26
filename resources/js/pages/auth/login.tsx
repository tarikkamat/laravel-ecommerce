import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <AuthLayout
            title="Giriş Yap"
            description="Hesabınıza erişmek için bilgilerinizi girin"
        >
            <Head title="Giriş Yap" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                    E-posta Adresi
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="ornek@eposta.com"
                                    className="h-11 rounded-xl border-gray-100 bg-white px-4 text-sm transition-all focus:border-[#ec135b] focus:ring-[#ec135b]/10 dark:border-gray-800 dark:bg-gray-950"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                        Şifre
                                    </Label>
                                    {canResetPassword && (
                                        <Link
                                            href={request()}
                                            className="text-[11px] font-bold uppercase tracking-wider text-[#ec135b] hover:opacity-80 transition-opacity"
                                            tabIndex={5}
                                        >
                                            Şifremi Unuttum
                                        </Link>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="h-11 rounded-xl border-gray-100 bg-white px-4 text-sm transition-all focus:border-[#ec135b] focus:ring-[#ec135b]/10 dark:border-gray-800 dark:bg-gray-950"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2.5">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="size-4 rounded-md border-gray-200 data-[state=checked]:bg-[#ec135b] data-[state=checked]:border-[#ec135b]"
                                />
                                <Label htmlFor="remember" className="text-xs font-medium text-gray-500 dark:text-gray-400 select-none">
                                    Beni hatırla
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="h-11 w-full rounded-xl bg-gray-900 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing ? <Spinner className="mr-2" /> : null}
                                Giriş Yap
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-xs text-gray-500">
                                Hesabınız yok mu?{' '}
                                <Link 
                                    href={register()} 
                                    className="font-bold text-[#ec135b] hover:underline" 
                                    tabIndex={5}
                                >
                                    Kayıt Olun
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 text-center text-xs font-medium text-emerald-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
