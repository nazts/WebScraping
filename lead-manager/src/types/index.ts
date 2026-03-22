export type ClientStatus = 'potencial' | 'proceso' | 'cerrado' | 'descartado';

export interface Client {
    id: string;
    nombre: string;
    negocio: string;
    telefono: string;
    email: string;
    ciudad: string;
    website?: string | null;
    estado: ClientStatus;
    descripcion?: string | null;
    monto?: number | null;
    fecha_cierre?: string | null;
    created_at: string;
}

export interface Archivo {
    id: string;
    client_id: string;
    file_url: string;
    name: string;
    created_at: string;
}

export interface DashboardStats {
    total: number;
    potenciales: number;
    noPotenciales: number;
    enProceso: number;
    cerrados: number;
    totalGenerado: number;
    promedio: number;
}
