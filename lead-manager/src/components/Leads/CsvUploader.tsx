import { useRef, useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud } from 'lucide-react';
import { useLeads } from '../../context/LeadContext';
import { Client } from '../../types';

export default function CsvUploader() {
    const fileInput = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const { addClients } = useLeads();

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const parsed: Partial<Client>[] = results.data.map((row: any) => ({
                        nombre: row.nombre || row.Name || row.name || 'Desconocido',
                        negocio: row.negocio || row.Business || row.business || '',
                        telefono: row.telefono || row.Phone || row.phone || '',
                        email: row.email || row.Email || '',
                        ciudad: row.ciudad || row.City || row.city || '',
                        website: row.website || row.Website || null,
                        estado: 'potencial', // default
                        descripcion: null,
                        monto: null,
                        fecha_cierre: null
                    }));

                    await addClients(parsed);
                    alert('CSV Subido correctamente.');
                } catch (error: any) {
                    alert('Error subiendo CSV: ' + error.message);
                } finally {
                    setLoading(false);
                    if (fileInput.current) fileInput.current.value = '';
                }
            },
            error: (error) => {
                alert('Error parseando CSV: ' + error.message);
                setLoading(false);
            }
        });
    };

    return (
        <div className="flex items-center gap-4">
            <input
                type="file"
                accept=".csv"
                ref={fileInput}
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
            />
            <label
                htmlFor="csv-upload"
                className="cursor-pointer bg-[var(--color-brand-100)] hover:bg-slate-300 text-white hover:text-[var(--color-brand-500)] px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow"
            >
                <UploadCloud className="w-5 h-5 mr-2" />
                {loading ? 'Subiendo...' : 'Importar CSV'}
            </label>
        </div>
    );
}
