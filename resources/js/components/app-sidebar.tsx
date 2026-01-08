import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { clearAuthSession } from '@/lib/http';
import { dashboard } from '@/routes';
import { SharedData, type NavItem } from '@/types';
import { router, Link, usePage } from '@inertiajs/react';
import { LayoutGrid, LogOut, NotebookPen, RotateCcw, Settings, Users2 } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const estudosNavItems: NavItem[] = [
    {
        title: 'Estudos',
        href: '/estudos',
        icon: NotebookPen,
    },
    {
        title: 'Revisao',
        href: '/revisao',
        icon: RotateCcw,
    },
    {
        title: 'Configuracao',
        href: '/revisao/configuracao',
        icon: Settings,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Usuários',
        href: '/users',
        icon: Users2,
    },
];

export function AppSidebar() {
    const { auth: { user } } = usePage<SharedData>().props;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain title='Principal' items={mainNavItems} />
                <NavMain title='Educacional' items={estudosNavItems} />

                {user.role === 'admin' && (
                    <NavMain title='Administração' items={adminNavItems} />
                )}
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => {
                                clearAuthSession();
                                router.post('/logout');
                            }}
                        >
                            <LogOut className="size-4" />
                            <span>Sair</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
