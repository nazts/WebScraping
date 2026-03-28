import { useState } from 'react';
import CsvUploader from '../components/Leads/CsvUploader';
import LeadsBoard from '../components/Leads/LeadsBoard';
import { useLeads } from '../context/LeadContext';
import { Search, AlertCircle, Globe, MapPin } from 'lucide-react';

const LANGUAGE_OPTIONS = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'pt', label: 'Português' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'all', label: 'Todos los idiomas' },
];

export default function Leads() {
    const { loading, error } = useLeads();
    const [filterText, setFilterText] = useState('');
    const [filterLanguage, setFilterLanguage] = useState('es');
    const [filterCity, setFilterCity] = useState('');

    if (loading) {
        return <div className="flex items-center justify-center h-full text-slate-400">Cargando leads...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                <AlertCircle className="w-16 h-16 opacity-50 text-red-400" />
                <h2 className="text-xl text-red-400">Error de conexión</h2>
                <p className="text-center max-w-md">No se pudo conectar con la base de datos. Verifica que el archivo <code className="text-indigo-400">.env</code> tenga configuradas las variables <code className="text-indigo-400">VITE_SUPABASE_URL</code> y <code className="text-indigo-400">VITE_SUPABASE_ANON_KEY</code>.</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col pt-2 animate-fade-in fade-in">
            <header className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Gestión de Leads</h1>
                        <p className="text-slate-400 mt-1 text-sm">Organiza, avanza y cierra clientes potenciales.</p>
                    </div>
                    <CsvUploader />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search by name / business */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o negocio..."
                            className="bg-[var(--color-brand-500)] border border-[var(--color-brand-300)] text-sm rounded-lg pl-10 pr-4 py-2 w-64 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                            value={filterText}
                            onChange={e => setFilterText(e.target.value)}
                        />
                    </div>

                    {/* Language filter */}
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="bg-[var(--color-brand-500)] border border-[var(--color-brand-300)] text-sm rounded-lg pl-10 pr-4 py-2 text-white focus:border-indigo-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                            value={filterLanguage}
                            onChange={e => setFilterLanguage(e.target.value)}
                            title="Filtrar por idioma"
                        >
                            {LANGUAGE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* City / province filter */}
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Filtrar por ciudad o provincia..."
                            className="bg-[var(--color-brand-500)] border border-[var(--color-brand-300)] text-sm rounded-lg pl-10 pr-4 py-2 w-56 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                            value={filterCity}
                            onChange={e => setFilterCity(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-hidden min-h-[500px]">
                <LeadsBoard filterText={filterText} filterLanguage={filterLanguage} filterCity={filterCity} />
            </div>
        </div>
    );
}
