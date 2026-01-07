import { useMemo, useState } from 'react';
import AuthLayout from '@/layouts/auth-layout';
import InputError from '@/components/input-error';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdatePassword } from '@/hooks/Auth/useUpdatePassword';
import {
    BookOpen,
    CheckCircle2,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    XCircle,
} from 'lucide-react';

export default function FirstAccessPassword() {
    const { updatePassword, isSaving, error, fieldErrors } = useUpdatePassword();
    const [formData, setFormData] = useState({
        password: '',
        password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validations = useMemo(
        () => ({
            minLength: formData.password.length >= 8,
            hasUppercase: /[A-Z]/.test(formData.password),
            hasLowercase: /[a-z]/.test(formData.password),
            hasNumber: /[0-9]/.test(formData.password),
            hasSpecial: /[!@#$%^&*(),.?\":{}|<>]/.test(formData.password),
            passwordsMatch:
                formData.password === formData.password_confirmation &&
                formData.password_confirmation.length > 0,
        }),
        [formData.password, formData.password_confirmation],
    );

    const validationScore = Object.values(validations).filter(Boolean).length;
    const allValid = validationScore === 6;

    const ValidationItem = ({ valid, text }: { valid: boolean; text: string }) => (
        <div
            className={`flex items-center gap-2 text-sm transition-colors duration-300 ${valid ? 'text-green-600' : 'text-muted-foreground'
                }`}
        >
            {valid ? (
                <CheckCircle2 className="h-4 w-4" />
            ) : (
                <XCircle className="h-4 w-4 text-muted-foreground/50" />
            )}
            <span>{text}</span>
        </div>
    );

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-0 shadow-2xl animate-in fade-in zoom-in duration-500">
                    <CardContent className="pt-10 pb-10 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Senha criada com sucesso!
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            Sua senha foi definida. Agora voce pode acessar o sistema normalmente.
                        </p>
                        <Button
                            className="w-full bg-red-500 hover:bg-red-600 text-white h-12 text-base cursor-pointer"
                            onClick={() => router.visit('/dashboard')}
                        >
                            Entrar no sistema
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center p-4">
            <Head title="Atualizar senha" />
            <div className="w-full max-w-md">
                <Card className="border-0 shadow-2xl">
                    <CardHeader className="text-center pb-2">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="h-6 w-6 text-red-500" />
                        </div>
                        <CardTitle className="text-xl">Primeiro Acesso</CardTitle>
                        <CardDescription>
                            Crie uma senha segura para acessar sua conta
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={async (event) => {
                                event.preventDefault();
                                if (!allValid) {
                                    return;
                                }
                                const success = await updatePassword(formData);
                                if (success) {
                                    setIsSuccess(true);
                                }
                            }}
                            className="space-y-5"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="password">Nova Senha</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Digite sua nova senha"
                                        value={formData.password}
                                        onChange={(event) =>
                                            setFormData({ ...formData, password: event.target.value })
                                        }
                                        className="h-12 pr-12 border-border/50 focus:border-red-500 focus:ring-red-500/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={fieldErrors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirme sua nova senha"
                                        value={formData.password_confirmation}
                                        onChange={(event) =>
                                            setFormData({
                                                ...formData,
                                                password_confirmation: event.target.value,
                                            })
                                        }
                                        className="h-12 pr-12 border-border/50 focus:border-red-500 focus:ring-red-500/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={fieldErrors.password_confirmation} />
                            </div>

                            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                                <p className="text-sm font-medium text-foreground mb-3">
                                    Sua senha deve conter:
                                </p>
                                <div className="grid grid-cols-1 gap-2">
                                    <ValidationItem
                                        valid={validations.minLength}
                                        text="Minimo de 8 caracteres"
                                    />
                                    <ValidationItem
                                        valid={validations.hasUppercase}
                                        text="Uma letra maiuscula"
                                    />
                                    <ValidationItem
                                        valid={validations.hasLowercase}
                                        text="Uma letra minuscula"
                                    />
                                    <ValidationItem valid={validations.hasNumber} text="Um numero" />
                                    <ValidationItem
                                        valid={validations.hasSpecial}
                                        text="Um caractere especial (!@#$%)"
                                    />
                                    <ValidationItem
                                        valid={validations.passwordsMatch}
                                        text="As senhas coincidem"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Forca da senha</span>
                                    <span
                                        className={`font-medium ${validationScore <= 2
                                                ? 'text-red-500'
                                                : validationScore <= 4
                                                    ? 'text-amber-500'
                                                    : 'text-green-500'
                                            }`}
                                    >
                                        {validationScore <= 2
                                            ? 'Fraca'
                                            : validationScore <= 4
                                                ? 'Media'
                                                : 'Forte'}
                                    </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${validationScore <= 2
                                                ? 'bg-red-500'
                                                : validationScore <= 4
                                                    ? 'bg-amber-500'
                                                    : 'bg-green-500'
                                            }`}
                                        style={{ width: `${(validationScore / 6) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {error ? <InputError message={error} /> : null}

                            <Button
                                type="submit"
                                disabled={!allValid || isSaving}
                                className="w-full h-12 bg-red-500 hover:bg-red-600 text-white text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Alterar senha...
                                    </>
                                ) : (
                                    'Alterar Senha'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    Precisa de ajuda?{' '}
                    <a href="#" className="text-red-500 hover:text-red-600 font-medium hover:underline">
                        Entre em contato
                    </a>
                </p>
            </div>
        </div>
    );
}
