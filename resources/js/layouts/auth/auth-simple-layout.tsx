import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    showHeader?: boolean;
    containerClassName?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
    showHeader = true,
    containerClassName,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className={cn('w-full max-w-sm', containerClassName)}>
                <div className="flex flex-col gap-8">
                    {showHeader && (
                        <div className="flex flex-col items-center gap-4">
                            <Link
                                href={home()}
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <div>
                                    <AppLogoIcon />
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-medium">
                                    {title}
                                </h1>
                                <p className="text-center text-sm text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
}
