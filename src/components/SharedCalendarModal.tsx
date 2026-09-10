import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, CheckCircle, Plus, Clock, AlertCircle } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { CalendarEvent } from '../types';

interface SharedCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SharedCalendarModal: React.FC<SharedCalendarModalProps> = ({ isOpen, onClose }) => {
  const {
    calendarEvents,
    addCalendarEvent,
    toggleCalendarEventCompleted,
    loans,
    transactions,
    formatMoney,
    user
  } = useFinancial();

  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newType, setNewType] = useState<CalendarEvent['tipo']>('familiar');
  const [newAmount, setNewAmount] = useState('');

  if (!isOpen) return null;

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCalendarEvent({
      title: newTitle.trim(),
      date: newDate,
      tipo: newType,
      amountDOP: newAmount ? parseFloat(newAmount) : undefined,
      assignedUserName: user.name,
    });

    setNewTitle('');
    setNewAmount('');
  };

  // Sort events by date
  const sortedEvents = [...calendarEvents].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl max-h-[88vh] flex flex-col rounded-2xl bg-[#0f172a] border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Calendario Financiero Compartido
              </h3>
              <p className="text-xs text-slate-400">Coordinación de pagos, vencimientos y tareas del hogar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Event Form */}
        <form onSubmit={handleAddEvent} className="p-4 bg-slate-950/40 border-b border-slate-800 space-y-2.5">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
            <Plus className="w-3.5 h-3.5 text-cyan-400" /> Añadir Evento o Recordatorio
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Título (ej: Pago cuota luz, Préstamo BHD...)"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <input
              type="date"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="pago_prestamo">Pago Préstamo / Deuda</option>
              <option value="gasto">Gasto / Servicio</option>
              <option value="ingreso">Ingreso / Quincena</option>
              <option value="meta">Meta de Ahorro</option>
              <option value="familiar">Evento Familiar</option>
            </select>
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="Monto RD$ (Opcional)"
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="w-full py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
            >
              Guardar Recordatorio
            </button>
          </div>
        </form>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No hay eventos programados en el calendario.
            </div>
          ) : (
            sortedEvents.map(event => {
              const isOverdue = !event.completed && new Date(event.date) < new Date(new Date().toISOString().split('T')[0]);
              return (
                <div
                  key={event.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    event.completed
                      ? 'bg-slate-900/30 border-slate-800/50 opacity-50'
                      : isOverdue
                      ? 'bg-rose-950/20 border-rose-500/40'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => toggleCalendarEventCompleted(event.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        event.completed
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'border-slate-700 hover:border-cyan-400'
                      }`}
                    >
                      {event.completed && <CheckCircle className="w-3.5 h-3.5" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${event.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                          {event.title}
                        </span>
                        {isOverdue && (
                          <span className="text-[9px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.2 rounded font-bold">
                            VENCIDO
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-cyan-300">{event.date}</span>
                        {event.time && <span>• {event.time}</span>}
                        {event.assignedUserName && <span>• Asignado a: {event.assignedUserName}</span>}
                      </div>
                    </div>
                  </div>

                  {event.amountDOP !== undefined && (
                    <div className="text-right flex-shrink-0 font-mono text-xs font-black text-amber-400">
                      {formatMoney(event.amountDOP)}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
