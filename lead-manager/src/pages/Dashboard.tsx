import { useLeads } from '../context/LeadContext';
import { Users, DollarSign, TrendingUp, Filter, AlertCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Dashboard() {
    const { clients, loading, getDashboardStats } = useLeads();

    if (loading) {
        return <div className="flex items-center justify-center h-full text-slate-400">Cargando Dashboard...</div>;
    }

    if (clients.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                <Users className="w-16 h-16 opacity-50" />
                <h2 className="text-xl">Sin Datos</h2>
                <p>Aún no has agregado ningún lead. Sube un CSV en la pestaña Leads.</p>
            </div>
        );
    }

    const stats = getDashboardStats();

    const chartData = [
        { name: 'Potenciales', count: stats.potenciales, fill: '#6868a6' },
        { name: 'En Proceso', count: stats.enProceso, fill: '#505077' },
        { name: 'Cerrados', count: stats.cerrados, fill: '#363659' },
        { name: 'Descartados', count: stats.noPotenciales, fill: '#21213b' },
    ];

    const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
        <div className="bg-[var(--color-brand-400)] rounded-xl p-6 border border-[var(--color-brand-300)] flex items-center shadow-lg transition-transform hover:-translate-y-1 duration-300">
            <div className={`p-4 rounded-lg bg-[var(--color-brand-500)] mr-4 border border-[var(--color-brand-300)]`}>
                <Icon className="w-6 h-6 text-slate-300" />
            </div>
            <div>
                <p className="text-sm text-slate-400 uppercase tracking-wider">{title}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard General</h1>
                <p className="text-slate-400 mt-2">Visión general del pipeline de ventas.</p>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Clientes" value={stats.total} icon={Users} color="text-indigo-400" />
                <StatCard title="Potenciales" value={stats.potenciales} icon={Filter} color="text-purple-400" />
                <StatCard title="En Proceso" value={stats.enProceso} icon={TrendingUp} color="text-blue-400" />
                <StatCard title="Cerrados" value={stats.cerrados} icon={CheckCircle} color="text-emerald-400" />

                <StatCard title="No Potenciales" value={stats.noPotenciales} icon={AlertCircle} color="text-red-400" />
                <StatCard title="Total Generado" value={`$${stats.totalGenerado.toLocaleString()}`} icon={DollarSign} color="text-green-400" />
                <StatCard title="Ticket Promedio" value={`$${Math.round(stats.promedio).toLocaleString()}`} icon={DollarSign} color="text-teal-400" />
            </div>

            {/* Chart */}
            <div className="bg-[var(--color-brand-400)] border border-[var(--color-brand-300)] rounded-xl p-6 shadow-xl w-full h-80">
                <h2 className="text-lg font-bold text-white mb-6">Pipeline de Clientes</h2>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#363659" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                        <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: 'rgba(54, 54, 89, 0.4)' }}
                            contentStyle={{ backgroundColor: '#21213b', borderColor: '#363659', color: '#fff' }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
