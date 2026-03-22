import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { Client, DashboardStats, ClientStatus } from '../types';

interface LeadContextProps {
    clients: Client[];
    loading: boolean;
    error: string | null;
    fetchClients: () => void;
    addClients: (clients: Partial<Client>[]) => Promise<void>;
    updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
    deleteClient: (id: string) => Promise<void>;
    getDashboardStats: () => DashboardStats;
}

const LeadContext = createContext<LeadContextProps | undefined>(undefined);

export function LeadProvider({ children }: { children: ReactNode }) {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClients = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            setError(error.message);
        } else if (data) {
            setClients(data as Client[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const addClients = async (newClients: Partial<Client>[]) => {
        const { data: existingData } = await supabase.from('clients').select('email');
        const existingEmails = new Set(existingData?.map((c) => c.email).filter(Boolean));

        const toInsert = newClients.filter(c => !existingEmails.has(c.email));

        if (toInsert.length === 0) return;

        const { error } = await supabase.from('clients').insert(toInsert);
        if (error) throw error;
        await fetchClients();
    };

    const updateClient = async (id: string, updates: Partial<Client>) => {
        // Optimistic UI Update for Snappy feel
        const previousClients = [...clients];
        setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } as Client : c));

        const { error } = await supabase
            .from('clients')
            .update(updates)
            .eq('id', id);

        if (error) {
            // Revert if error
            setClients(previousClients);
            throw error;
        }
    };

    const deleteClient = async (id: string) => {
        const previousClients = [...clients];
        setClients(prev => prev.filter(c => c.id !== id));

        const { error } = await supabase.from('clients').delete().eq('id', id);
        if (error) {
            setClients(previousClients);
            throw error;
        }
    };

    const getDashboardStats = (): DashboardStats => {
        const total = clients.length;
        let potenciales = 0;
        let noPotenciales = 0;
        let enProceso = 0;
        let cerrados = 0;
        let totalGenerado = 0;

        clients.forEach(c => {
            if (c.estado === 'potencial') potenciales++;
            else if (c.estado === 'proceso') enProceso++;
            else if (c.estado === 'cerrado') {
                cerrados++;
                if (c.monto) totalGenerado += c.monto;
            }
            else if (c.estado === 'descartado') noPotenciales++;
        });

        const promedio = cerrados > 0 ? totalGenerado / cerrados : 0;

        return {
            total,
            potenciales,
            noPotenciales,
            enProceso,
            cerrados,
            totalGenerado,
            promedio
        };
    };

    return (
        <LeadContext.Provider value={{ clients, loading, error, fetchClients, addClients, updateClient, deleteClient, getDashboardStats }}>
            {children}
        </LeadContext.Provider>
    );
}

export function useLeads() {
    const context = useContext(LeadContext);
    if (context === undefined) {
        throw new Error('useLeads must be used within a LeadProvider');
    }
    return context;
}
