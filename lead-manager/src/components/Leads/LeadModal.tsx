import { useState, useEffect } from 'react';
import { X, Save, Upload, Trash2 } from 'lucide-react';
import type { Client, Archivo } from '../../types';
import { useLeads } from '../../context/LeadContext';
import { supabase } from '../../lib/supabase';

interface Props {
    client: Client;
    onClose: () => void;
}

export default function LeadModal({ client, onClose }: Props) {
    const { updateClient, deleteClient } = useLeads();
    const [desc, setDesc] = useState(client.descripcion || '');
    const [monto, setMonto] = useState(client.monto || '');
    const [archivos, setArchivos] = useState<Archivo[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchArchivos();
    }, [client.id]);

    const fetchArchivos = async () => {
        const { data } = await supabase.from('archivos').select('*').eq('client_id', client.id);
        if (data) setArchivos(data as Archivo[]);
    };

    const handleSave = async () => {
        await updateClient(client.id, {
            descripcion: desc,
            monto: monto ? parseFloat(monto.toString()) : null,
        });
        alert('Guardado exitosamente');
        onClose();
    };

    const handleDelete = async () => {
        if (confirm('¿Seguro que deseas eliminar este lead?')) {
            await deleteClient(client.id);
            onClose();
        }
    };

    const markClosed = async () => {
        await updateClient(client.id, {
            estado: 'cerrado',
            fecha_cierre: new Date().toISOString()
        });
        alert('¡Felicidades! Cliente marcado como cerrado.');
        onClose();
    };

    const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const fileName = `${client.id}/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
            .from('archivos')
            .upload(fileName, file);

        if (uploadError) {
            alert('Error subiendo: ' + uploadError.message);
            setUploading(false);
            return;
        }

        const { data: publicUrl } = supabase.storage.from('archivos').getPublicUrl(fileName);

        const { error: dbError } = await supabase.from('archivos').insert({
            client_id: client.id,
            file_url: publicUrl.publicUrl,
            name: file.name
        });

        if (dbError) alert('Error guardando en BD: ' + dbError.message);
        else await fetchArchivos();

        setUploading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-[var(--color-brand-400)] rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in fade-in" onClick={e => e.stopPropagation()}>
                <div className="bg-[var(--color-brand-300)] px-6 py-4 flex justify-between items-center border-b border-[var(--color-brand-200)]">
                    <h2 className="text-xl font-bold text-white">{client.nombre} <span className="text-indigo-300 text-sm ml-2">({client.negocio})</span></h2>
                    <button onClick={onClose} className="text-slate-300 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div><p className="text-xs text-slate-400">Email</p><p>{client.email}</p></div>
                        <div><p className="text-xs text-slate-400">Teléfono</p><p>{client.telefono}</p></div>
                        <div><p className="text-xs text-slate-400">Ciudad</p><p>{client.ciudad}</p></div>
                        <div><p className="text-xs text-slate-400">País</p><p>{client.pais || 'N/A'}</p></div>
                        <div><p className="text-xs text-slate-400">Idioma</p><p>{client.idioma || 'es'}</p></div>
                        <div><p className="text-xs text-slate-400">Website</p><p>{client.website || 'N/A'}</p></div>
                    </div>

                    {/* Editor */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-slate-400 block mb-1">Descripción del Proyecto</label>
                            <textarea
                                className="w-full bg-[var(--color-brand-500)] bg-opacity-50 border border-[var(--color-brand-300)] rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors h-24"
                                value={desc}
                                onChange={e => setDesc(e.target.value)}
                                placeholder="Escribe los detalles del proyecto aquí..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-end">
                            <div>
                                <label className="text-sm text-slate-400 block mb-1">Monto Acordado (USD)</label>
                                <input
                                    type="number"
                                    className="w-full bg-[var(--color-brand-500)] border border-[var(--color-brand-300)] rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                                    value={monto}
                                    onChange={e => setMonto(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="cursor-pointer flex items-center justify-center bg-[var(--color-brand-300)] hover:bg-[var(--color-brand-200)] text-white px-4 py-3 rounded-lg shadow-sm border border-transparent transition-all">
                                    <Upload className="w-4 h-4 mr-2" />
                                    {uploading ? 'Subiendo...' : 'Subir Documento'}
                                    <input type="file" onChange={uploadFile} className="hidden" />
                                </label>
                            </div>
                        </div>

                        {/* Archivos List */}
                        {archivos.length > 0 && (
                            <div className="mt-4 p-4 bg-[var(--color-brand-500)] rounded-lg border border-[var(--color-brand-300)]">
                                <h4 className="text-sm text-slate-400 mb-2">Documentos Adjuntos</h4>
                                <div className="space-y-2">
                                    {archivos.map(a => (
                                        <div key={a.id} className="flex justify-between items-center text-sm py-2 border-b border-[var(--color-brand-400)] last:border-0">
                                            <a href={a.file_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center">
                                                📄 {a.name}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 bg-[var(--color-brand-500)] border-t border-[var(--color-brand-300)] flex justify-between items-center gap-2">
                    <button onClick={handleDelete} className="text-red-400 hover:text-red-300 flex items-center px-4 py-2 hover:bg-[var(--color-brand-400)] rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                    </button>

                    <div className="flex gap-3">
                        {client.estado !== 'cerrado' && (
                            <button onClick={markClosed} className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 px-6 py-2 rounded-lg transition-colors font-medium">
                                Marcar Cerrado
                            </button>
                        )}
                        <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg flex items-center font-medium shadow-lg transition-all">
                            <Save className="w-4 h-4 mr-2" /> Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
