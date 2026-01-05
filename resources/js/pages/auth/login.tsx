import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { notifications } from '@/components/ui/notification';
import AuthLayout from '@/layouts/auth-layout';
import { request } from '@/routes/password';
import { Head } from '@inertiajs/react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLogin } from '@/hooks/Auth/useLogin';
import LoginFooter from './components/LoginFooter';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    const { isLoading, error, handleLogin } = useLogin();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const hasShownStatus = useRef(false);

    useEffect(() => {
        if (status && !hasShownStatus.current) {
            hasShownStatus.current = true;
            notifications.success(status);
        }
    }, [status]);

    return (
        <AuthLayout
            title="Log in to your account"
            description=""
            showHeader={false}
            containerClassName="max-w-md"
        >
            <Head title="Log in" />

            <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center gap-0">
                    <div className="h-22 w-64">
                        <AppLogoIcon className="h-full w-full object-contain" />
                    </div>
                </div>

                <Card className="border-border/50 shadow-xl">
                    <CardHeader className="gap-1">
                        <CardTitle className="text-center text-2xl font-bold">
                            Bem-vindo
                        </CardTitle>
                        <CardDescription className="text-center">
                            Entre com suas credenciais para acessar sua conta
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={(event) => {
                                event.preventDefault();
                                void handleLogin(email, password);
                            }}
                        >
                            <InputError className="text-center" message={error ?? undefined} />
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="seu@email.com"
                                    className="h-11"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Digite sua senha"
                                        className="h-11 pr-10"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((current) => !current)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                                        aria-label={
                                            showPassword
                                                ? 'Ocultar senha'
                                                : 'Mostrar senha'
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="remember" name="remember" tabIndex={3} />
                                    <Label htmlFor="remember">Lembrar de mim</Label>
                                </div>
                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className="text-sm font-medium"
                                        tabIndex={5}
                                    >
                                        Esqueceu a senha?
                                    </TextLink>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="h-11 w-full text-white font-semibold bg-red-600 cursor-pointer hover:bg-red-700 focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                tabIndex={4}
                                disabled={isLoading}
                                data-test="login-button"
                            >
                                {isLoading ? (
                                    <Spinner className="mr-2" />
                                ) : (
                                    <LockKeyhole className="mr-2 h-5 w-5" />
                                )}
                                {isLoading ? 'Entrando...' : 'Entrar'}
                            </Button>
                        </form>
                    </CardContent>

                    <LoginFooter canRegister={canRegister} activeLoginSSO={false} />
                </Card>

                <p className="text-center text-xs text-muted-foreground">
                    Ao continuar, voce concorda com nossos{' '}
                    <a href="#" className="underline hover:text-foreground">
                        Termos de Servico
                    </a>{' '}
                    e{' '}
                    <a href="#" className="underline hover:text-foreground">
                        Politica de Privacidade
                    </a>
                </p>
            </div>
        </AuthLayout>
    );
}
