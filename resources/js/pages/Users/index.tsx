import { useEffect, useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import UsersStatsCards from './components/UsersStatsCards';
import UsersFilters from './components/UsersFilters';
import UsersTable from './components/UsersTable';
import UserFormModal, { type UserFormData, type UserRole, type UserStatus } from './components/UserFormModal';
import UserDeleteModal from './components/UserDeleteModal';
import { useGetUsers, type User as ApiUser } from '@/hooks/Users/useGetUsers';
import { useToggleUserStatus } from '@/hooks/Users/useToggleUserStatus';

export default function UsersManagement() {
    const { users, isLoading, fetchUsers, setUsers } = useGetUsers();
    const { toggleStatus } = useToggleUserStatus();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('todos');
    const [filterStatus, setFilterStatus] = useState<string>('todos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<ApiUser | null>(null);
    const [userToDelete, setUserToDelete] = useState<ApiUser | null>(null);

    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        phone: '',
        role: 'user' as UserRole,
        status: 'ativo' as UserStatus,
        password: '',
        passwordConfirmation: '',
        mustResetPassword: true,
    });

    const filteredUsers = useMemo(
        () =>
            users.filter((user) => {
                const matchesSearch =
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesRole = filterRole === 'todos' || user.role === filterRole;
                const matchesStatus = filterStatus === 'todos' || user.status === filterStatus;
                return matchesSearch && matchesRole && matchesStatus;
            }),
        [users, searchTerm, filterRole, filterStatus],
    );

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            role: 'user',
            status: 'ativo',
            password: '',
            passwordConfirmation: '',
            mustResetPassword: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (user: ApiUser) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            password: '',
            passwordConfirmation: '',
            mustResetPassword: user.mustResetPassword ?? false,
        });
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (userId: string) => {
        const updated = await toggleStatus(userId);
        if (updated) {
            setUsers((current) =>
                current.map((user) =>
                    user.id === userId
                        ? { ...user, status: user.status === 'ativo' ? 'inativo' : 'ativo' }
                        : user,
                ),
            );
        }
    };

    const openDeleteModal = (user: ApiUser) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleDeleted = () => {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        fetchUsers();
    };

    const handleSaved = () => {
        setIsModalOpen(false);
        fetchUsers();
    };

    const stats = {
        total: users.length,
        ativos: users.filter((user) => user.status === 'ativo').length,
        inativos: users.filter((user) => user.status === 'inativo').length,
        admins: users.filter((user) => user.role === 'admin').length,
    };

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <AppLayout>
            <Head title="Usuarios" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <div className="container mx-auto p-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">
                                Gerenciamento de Usuarios
                            </h1>
                            <p className="text-slate-500 mt-1">
                                Gerencie todos os usuarios do sistema
                            </p>
                        </div>
                        <Button
                            onClick={openCreateModal}
                            className="bg-red-500 hover:bg-red-600 text-white gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Novo Usuario
                        </Button>
                    </div>

                    <UsersStatsCards
                        total={stats.total}
                        ativos={stats.ativos}
                        inativos={stats.inativos}
                        admins={stats.admins}
                    />

                    <UsersFilters
                        searchTerm={searchTerm}
                        filterRole={filterRole}
                        filterStatus={filterStatus}
                        onSearchChange={setSearchTerm}
                        onRoleChange={setFilterRole}
                        onStatusChange={setFilterStatus}
                    />

                    <UsersTable
                        users={filteredUsers}
                        onEdit={openEditModal}
                        onToggleStatus={handleToggleStatus}
                        onDelete={openDeleteModal}
                    />
                </div>
                <UserFormModal
                    open={isModalOpen}
                    isEditing={Boolean(editingUser)}
                    formData={formData}
                    userId={editingUser?.id ?? null}
                    onClose={() => setIsModalOpen(false)}
                    onSaved={handleSaved}
                    onChange={setFormData}
                />

                <UserDeleteModal
                    open={isDeleteModalOpen}
                    userId={userToDelete?.id ?? null}
                    userName={userToDelete?.name ?? null}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDeleted={handleDeleted}
                />
            </div>
        </AppLayout>
    );
}
