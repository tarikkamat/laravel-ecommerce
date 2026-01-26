import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/two-factor/login';
import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useMemo, useState } from 'react';

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Kurtarma Kodu',
                description:
                    'Lütfen acil durum kurtarma kodlarınızdan birini girerek hesabınıza erişimi onaylayın.',
                toggleText: 'Doğrulama kodu kullan',
            };
        }

        return {
            title: 'Doğrulama Kodu',
            description:
                'Kimlik doğrulama uygulamanız tarafından sağlanan kodu girin.',
            toggleText: 'Kurtarma kodu kullan',
        };
    }, [showRecoveryInput]);

    const toggleRecoveryMode = (clearErrors: () => void): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
    };

    return (
        <AuthLayout
            title={authConfigContent.title}
            description={authConfigContent.description}
        >
            <Head title="İki Faktörlü Doğrulama" />

            <div className="space-y-6">
                <Form
                    {...store.form()}
                    className="space-y-4"
                    resetOnError
                    resetOnSuccess={!showRecoveryInput}
                >
                    {({ errors, processing, clearErrors }) => (
                        <>
                            {showRecoveryInput ? (
                                <div className="space-y-1.5">
                                    <Input
                                        name="recovery_code"
                                        type="text"
                                        placeholder="Kurtarma kodunu girin"
                                        autoFocus={showRecoveryInput}
                                        required
                                        className="h-11 rounded-xl border-gray-100 bg-white px-4 text-sm transition-all focus:border-[#ec135b] focus:ring-[#ec135b]/10 dark:border-gray-800 dark:bg-gray-950"
                                    />
                                    <InputError message={errors.recovery_code} />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <div className="flex w-full items-center justify-center">
                                        <InputOTP
                                            name="code"
                                            maxLength={OTP_MAX_LENGTH}
                                            value={code}
                                            onChange={(value) => setCode(value)}
                                            disabled={processing}
                                            pattern={REGEXP_ONLY_DIGITS}
                                        >
                                            <InputOTPGroup className="gap-2">
                                                {Array.from(
                                                    { length: OTP_MAX_LENGTH },
                                                    (_, index) => (
                                                        <InputOTPSlot
                                                            key={index}
                                                            index={index}
                                                            className="size-11 rounded-xl border-gray-100 bg-white text-base font-bold dark:border-gray-800 dark:bg-gray-950"
                                                        />
                                                    ),
                                                )}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    <InputError message={errors.code} />
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="h-11 w-full rounded-xl bg-gray-900 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                                disabled={processing}
                            >
                                Devam Et
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    className="text-[11px] font-bold uppercase tracking-wider text-[#ec135b] hover:opacity-80 transition-opacity"
                                    onClick={() =>
                                        toggleRecoveryMode(clearErrors)
                                    }
                                >
                                    {authConfigContent.toggleText}
                                </button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AuthLayout>
    );
}
