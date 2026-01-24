import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
    loading?: boolean;
    loadingText?: string;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
    ({ loading = false, loadingText = 'Kaydediliyor...', disabled, children, ...props }, ref) => {
        return (
            <Button ref={ref} disabled={disabled || loading} {...props}>
                {loading ? (
                    <>
                        <Spinner data-icon="inline-start" />
                        {loadingText}
                    </>
                ) : (
                    children
                )}
            </Button>
        );
    }
);

LoadingButton.displayName = 'LoadingButton';

export { LoadingButton };
