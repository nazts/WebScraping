import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export default function Sidebar() {
    const links = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Leads (CRM)', path: '/leads', icon: Users },
    ];

    return (
        <aside className="w-64 bg-[var(--color-brand-400)] border-r border-[var(--color-brand-300)] hidden md:flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-[var(--color-brand-300)]">
                <UserPlus className="h-6 w-6 text-indigo-400 mr-2" />
                <h1 className="text-xl font-bold tracking-wider text-slate-100 uppercase">LeadX</h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {links.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center px-4 py-3 rounded-lg transition-colors group',
                                isActive
                                    ? 'bg-[var(--color-brand-300)] text-white'
                                    : 'text-slate-400 hover:bg-[var(--color-brand-500)] hover:text-white'
                            )
                        }
                    >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-[var(--color-brand-300)] text-xs text-slate-500 text-center">
                Lead Manager © 2026
            </div>
        </aside>
    );
}
