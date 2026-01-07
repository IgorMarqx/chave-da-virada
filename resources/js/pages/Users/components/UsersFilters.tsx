import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';

type UsersFiltersProps = {
    searchTerm: string;
    filterRole: string;
    filterStatus: string;
    onSearchChange: (value: string) => void;
    onRoleChange: (value: string) => void;
    onStatusChange: (value: string) => void;
};

export default function UsersFilters({
    searchTerm,
    filterRole,
    filterStatus,
    onSearchChange,
    onRoleChange,
    onStatusChange,
}: UsersFiltersProps) {
    return (
        <Card className="border-0 shadow-sm mb-6">
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Buscar por nome ou email..."
                            value={searchTerm}
                            onChange={(event) => onSearchChange(event.target.value)}
                            className="pl-10 border-slate-200"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Select value={filterRole} onValueChange={onRoleChange}>
                            <SelectTrigger className="w-40 border-slate-200">
                                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                                <SelectValue placeholder="Cargo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos os cargos</SelectItem>
                                <SelectItem value="admin">Administrador</SelectItem>
                                <SelectItem value="user">Usuario</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterStatus} onValueChange={onStatusChange}>
                            <SelectTrigger className="w-36 border-slate-200">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                <SelectItem value="ativo">Ativos</SelectItem>
                                <SelectItem value="inativo">Inativos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
