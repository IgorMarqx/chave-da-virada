import { Card, CardContent } from '@/components/ui/card';
import { Shield, UserCheck, UserX, Users } from 'lucide-react';

type UsersStatsCardsProps = {
    total: number;
    ativos: number;
    inativos: number;
    admins: number;
};

export default function UsersStatsCards({ total, ativos, inativos, admins }: UsersStatsCardsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <Users className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{total}</p>
                            <p className="text-sm text-slate-500">Total</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <UserCheck className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{ativos}</p>
                            <p className="text-sm text-slate-500">Ativos</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <UserX className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{inativos}</p>
                            <p className="text-sm text-slate-500">Inativos</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Shield className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{admins}</p>
                            <p className="text-sm text-slate-500">Admins</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
