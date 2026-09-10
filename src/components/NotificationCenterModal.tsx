import React, { useState } from 'react';
import { X, Bell, CheckCheck, Clock, ArrowUpRight, ArrowDownLeft, Trash2, History } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    activityLogs,
  } = useFinancial();

  const [activeTab, setActiveTab] = useState<'notifs' | 'audit'>('notifs');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl bg-[#0f172a] border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Centro de Actividad Familiar
              </h3>
              <p className="text-[11px] text-slate-400">Eventos y cambios sincronizados en tiempo real</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5">
          <button
            onClick={() => setActiveTab('notifs')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'notifs'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notificaciones ({notifications.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Historial Auditoría ({activityLogs.length})</span>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {activeTab === 'notifs' ? (
            notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No hay notificaciones pendientes.
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    n.read
                      ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                      : 'bg-slate-900 border-cyan-500/30 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-cyan-400 uppercase tracking-wider">{n.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {n.timestamp}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white mb-0.5">{n.title}</div>
                  <div className="text-[11px] text-slate-300">{n.message}</div>
                </div>
              ))
            )
          ) : (
            activityLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No hay registros de actividad recientes.
              </div>
            ) : (
              activityLogs.map(log => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase text-cyan-400">{log.userName}</span>
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">{log.section}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 mt-0.5">{log.action}</div>
                    <div className="text-[11px] text-slate-400 truncate">{log.details}</div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap pt-0.5">{log.timestamp.substring(11)}</span>
                </div>
              ))
            )
          )}
        </div>

        {/* Footer */}
        {activeTab === 'notifs' && notifications.length > 0 && (
          <div className="border-t border-slate-800 p-3 bg-slate-950/60 flex justify-end">
            <button
              onClick={clearAllNotifications}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-rose-950/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Borrar Todas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
