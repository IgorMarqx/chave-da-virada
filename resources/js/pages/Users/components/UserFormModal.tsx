import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Mail, Phone, Users, X } from 'lucide-react';
import { useCreateUser } from '@/hooks/Users/useCreateUser';
import { useUpdateUser } from '@/hooks/Users/useUpdateUser';

type UserRole = 'admin' | 'user';
type UserStatus = 'ativo' | 'inativo';

type UserFormData = {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    password: string;
    passwordConfirmation: string;
    mustResetPassword: boolean;
};

type UserFormModalProps = {
    open: boolean;
    isEditing: boolean;
    formData: UserFormData;
    userId?: string | null;
    onClose: () => void;
    onSaved: () => void;
    onChange: (data: UserFormData) => void;
};

export default function UserFormModal({
    open,
    isEditing,
    formData,
    userId,
    onClose,
    onSaved,
    onChange,
}: UserFormModalProps) {
    const { createUser, isCreating } = useCreateUser();
    const { updateUser, isUpdating } = useUpdateUser();

    if (!open) {
        return null;
    }

    const handleSubmit = async () => {
        const payload = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            status: formData.status,
            must_reset_password: formData.mustResetPassword,
        };

        if (isEditing && userId) {
            const updated = await updateUser({
                id: userId,
                ...payload,
                ...(formData.password
                    ? {
                          password: formData.password,
                          password_confirmation: formData.passwordConfirmation,
                      }
                    : {}),
            });
            if (updated) {
                onSaved();
            }
            return;
        }

        const created = await createUser({
            ...payload,
            password: formData.password,
            password_confirmation: formData.passwordConfirmation,
        });
        if (created) {
            onSaved();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">
                            {isEditing ? 'Editar Usuario' : 'Novo Usuario'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {isEditing
                                ? 'Atualize as informacoes do usuario'
                                : 'Preencha os dados para criar um novo usuario'}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0 rounded-full"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">Nome completo</Label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Digite o nome completo"
                                value={formData.name}
                                onChange={(event) => onChange({ ...formData, name: event.target.value })}
                                className="pl-10 border-slate-200"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                type="email"
                                placeholder="email@exemplo.com"
                                value={formData.email}
                                onChange={(event) => onChange({ ...formData, email: event.target.value })}
                                className="pl-10 border-slate-200"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">Telefone</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="(00) 00000-0000"
                                value={formData.phone}
                                onChange={(event) => onChange({ ...formData, phone: event.target.value })}
                                className="pl-10 border-slate-200"
                            />
                        </div>
                    </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">Cargo</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value: UserRole) => onChange({ ...formData, role: value })}
                            >
                                <SelectTrigger className="border-slate-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="admin">Administrador</SelectItem>
                                <SelectItem value="user">Usuario</SelectItem>
                                </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: UserStatus) => onChange({ ...formData, status: value })}
                            >
                                <SelectTrigger className="border-slate-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ativo">Ativo</SelectItem>
                                    <SelectItem value="inativo">Inativo</SelectItem>
                                </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Senha inicial</Label>
                    <Input
                        type="password"
                        placeholder={isEditing ? 'Deixe em branco para manter' : 'Digite a senha'}
                        value={formData.password}
                        onChange={(event) =>
                            onChange({ ...formData, password: event.target.value })
                        }
                        className="border-slate-200"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Confirmar senha</Label>
                    <Input
                        type="password"
                        placeholder="Confirme a senha"
                        value={formData.passwordConfirmation}
                        onChange={(event) =>
                            onChange({ ...formData, passwordConfirmation: event.target.value })
                        }
                        className="border-slate-200"
                    />
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                    <input
                        id="must-reset-password"
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-red-500"
                        checked={formData.mustResetPassword}
                        onChange={(event) =>
                            onChange({ ...formData, mustResetPassword: event.target.checked })
                        }
                    />
                    <Label htmlFor="must-reset-password" className="text-sm text-slate-600">
                        Exigir troca de senha no primeiro acesso
                    </Label>
                </div>
            </div>

                <div className="flex justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
                    <Button variant="outline" onClick={onClose} className="border-slate-200">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-red-500 hover:bg-red-600 text-white"
                        disabled={!formData.name || !formData.email || isCreating || isUpdating}
                    >
                        {isEditing
                            ? isUpdating
                                ? 'Salvando...'
                                : 'Salvar Alteracoes'
                            : isCreating
                              ? 'Criando...'
                              : 'Criar Usuario'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export type { UserFormData, UserRole, UserStatus };
