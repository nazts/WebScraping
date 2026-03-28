import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useLeads } from '../../context/LeadContext';
import type { ClientStatus } from '../../types';
import LeadCard from './LeadCard';

const COLUMNS: { id: ClientStatus; title: string, color: string }[] = [
    { id: 'potencial', title: 'Potenciales', color: 'border-purple-400/50' },
    { id: 'proceso', title: 'En Proceso', color: 'border-blue-400/50' },
    { id: 'cerrado', title: 'Cerrados', color: 'border-emerald-400/50' },
    { id: 'descartado', title: 'No Potenciales', color: 'border-red-400/50' }
];

interface Props {
    filterText: string;
    filterLanguage: string;
    filterCity: string;
}

export default function LeadsBoard({ filterText, filterLanguage, filterCity }: Props) {
    const { clients, updateClient } = useLeads();

    const handleDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId) return;

        try {
            await updateClient(draggableId, { estado: destination.droppableId as ClientStatus });
        } catch (e) {
            alert('Error moviendo lead');
        }
    };

    const isMatched = (c: any) => {
        if (filterText) {
            const s = filterText.toLowerCase();
            if (!c.nombre?.toLowerCase().includes(s) && !c.negocio?.toLowerCase().includes(s)) return false;
        }

        if (filterLanguage && filterLanguage !== 'all') {
            const leadIdioma = c.idioma?.toLowerCase() ?? '';
            if (leadIdioma !== filterLanguage.toLowerCase()) return false;
        }

        if (filterCity) {
            const cityQuery = filterCity.toLowerCase();
            if (!c.ciudad?.toLowerCase().includes(cityQuery)) return false;
        }

        return true;
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 h-full overflow-x-auto kanban-scroll pb-4">
                {COLUMNS.map(col => {
                    const colClients = clients.filter(c => c.estado === col.id && isMatched(c));

                    return (
                        <div key={col.id} className={`flex-shrink-0 w-80 bg-[var(--color-brand-400)]/50 rounded-xl flex flex-col border border-[var(--color-brand-300)] overflow-hidden`}>
                            <div className={`p-4 font-bold text-white border-b-2 ${col.color} bg-[var(--color-brand-500)]/80 flex justify-between items-center`}>
                                <h3 className="uppercase tracking-wider text-sm">{col.title}</h3>
                                <span className="bg-[var(--color-brand-300)] text-xs py-1 px-2 rounded-full font-mono">{colClients.length}</span>
                            </div>

                            <Droppable droppableId={col.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 p-3 overflow-y-auto kanban-scroll transition-colors duration-200
                      ${snapshot.isDraggingOver ? 'bg-[var(--color-brand-300)]/20' : ''}
                    `}
                                    >
                                        {colClients.map((client, index) => (
                                            <LeadCard key={client.id} client={client} index={index} />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </div>
        </DragDropContext>
    );
}
