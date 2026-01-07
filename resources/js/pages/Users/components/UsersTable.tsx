import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash2, UserCheck, UserX, Users } from 'lucide-react';

type UserRole = 'admin' | 'user';
type UserStatus = 'ativo' | 'inativo';

type User = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    lastAccess: string;
};

type UsersTableProps = {
    users: User[];
    onEdit: (user: User) => void;
    onToggleStatus: (userId: string) => void;
    onDelete: (user: User) => void;
};

const getRoleBadge = (role: UserRole) => {
    const styles = {
        admin: 'bg-red-100 text-red-700 border-red-200',
        user: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    const labels = {
        admin: 'Administrador',
        user: 'Usuario',
    };
    return (
        <Badge variant="outline" className={styles[role]}>
            {labels[role]}
        </Badge>
    );
};

const getStatusBadge = (status: UserStatus) => {
    return status === 'ativo' ? (
        <Badge className="bg-emerald-500 hover:bg-emerald-600">Ativo</Badge>
    ) : (
        <Badge variant="secondary" className="bg-gray-200 text-gray-600">
            Inativo
        </Badge>
    );
};

export default function UsersTable({ users, onEdit, onToggleStatus, onDelete }: UsersTableProps) {
    const formatDate = (value: string) => {
        if (!value || value === '-') {
            return value;
        }

        return new Date(value).toLocaleDateString('pt-BR');
    };

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-700">
                    Usuarios ({users.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 hover:bg-slate-50">
                                <TableHead className="font-semibold text-slate-600">Nome</TableHead>
                                <TableHead className="font-semibold text-slate-600">Email</TableHead>
                                <TableHead className="font-semibold text-slate-600">Telefone</TableHead>
                                <TableHead className="font-semibold text-slate-600">Cargo</TableHead>
                                <TableHead className="font-semibold text-slate-600">Status</TableHead>
                                <TableHead className="font-semibold text-slate-600">Ultimo Acesso</TableHead>
                                <TableHead className="font-semibold text-slate-600 text-right">Acoes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-medium text-slate-800">
                                        {user.name}
                                    </TableCell>
                                    <TableCell className="text-slate-600">{user.email}</TableCell>
                                    <TableCell className="text-slate-600">{user.phone}</TableCell>
                                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                                    <TableCell className="text-slate-500">
                                        {formatDate(user.lastAccess)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onEdit(user)}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onToggleStatus(user.id)}>
                                                    {user.status === 'ativo' ? (
                                                        <>
                                                            <UserX className="w-4 h-4 mr-2" />
                                                            Desativar
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserCheck className="w-4 h-4 mr-2" />
                                                            Ativar
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onDelete(user)}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {users.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>Nenhum usuario encontrado</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
