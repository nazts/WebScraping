import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Client } from '../../types';
import { Mail, Phone, Calendar, ArrowRight } from 'lucide-react';
import LeadModal from './LeadModal';
import { useLeads } from '../../context/LeadContext';

interface Props {
    client: Client;
    index: number;
}

export default function LeadCard({ client, index }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { updateClient } = useLeads();

    return (
        <>
            <Draggable draggableId={client.id} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-4 mb-3 rounded-lg border text-sm transition-all duration-200 cursor-pointer 
              ${snapshot.isDragging ? 'bg-[var(--color-brand-300)] border-indigo-400 shadow-xl scale-105 z-50' : 'bg-[var(--color-brand-400)] border-[var(--color-brand-300)] hover:border-indigo-500 shadow-md'}
            `}
                        onClick={() => setIsModalOpen(true)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-white tracking-wide">{client.nombre}</h3>
                            {client.monto && <span className="text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-400/10 rounded-full text-xs">${client.monto}</span>}
                        </div>

                        <p className="text-slate-400 text-xs font-medium uppercase mb-3">{client.negocio || 'Sin negocio'}</p>

                        <div className="flex items-center text-slate-300 text-xs mb-1">
                            <Phone className="w-3 h-3 mr-2 text-indigo-400" />
                            {client.telefono || 'Sin teléfono'}
                        </div>
                        <div className="flex items-center text-slate-300 text-xs mb-3">
                            <Mail className="w-3 h-3 mr-2 text-indigo-400" />
                            <span className="truncate">{client.email || 'Sin email'}</span>
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-[var(--color-brand-300)]">
                            <div className="text-[10px] text-slate-500 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(client.created_at).toLocaleDateString()}
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsModalOpen(true);
                                }}
                                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center font-medium transition-colors"
                            >
                                Detalles <ArrowRight className="w-3 h-3 ml-1" />
                            </button>
                        </div>
                    </div>
                )}
            </Draggable>

            {isModalOpen && (
                <LeadModal client={client} onClose={() => setIsModalOpen(false)} />
            )}
        </>
    );
}
