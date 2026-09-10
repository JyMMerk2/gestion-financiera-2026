import React from 'react';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Bell,
  Calendar,
  Lock,
  Download,
  Users,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  FileSpreadsheet,
  HelpCircle,
  FileText,
  Activity,
  Smartphone,
  UserPlus,
  Key
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

interface TopBarProps {
  onOpenFamily: () => void;
  onOpenCalendar: () => void;
  onOpenNotifications: () => void;
  onOpenExport: () => void;
  onOpenDocs: () => void;
  onOpenTests: () => void;
  onOpenInstall: () => void;
  onOpenHelp: () => void;
  onOpenUserAuth: (mode?: 'register' | 'login' | 'recover' | 'join') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenFamily,
  onOpenCalendar,
  onOpenNotifications,
  onOpenExport,
  onOpenDocs,
  onOpenTests,
  onOpenInstall,
  onOpenHelp,
  onOpenUserAuth,
}) => {
  const {
    user,
    family,
    isPrivacyMode,
    togglePrivacyMode,
    theme,
    toggleTheme,
    lockApp,
    exchangeRates,
    isOnline,
    offlineQueue,
    syncOfflineQueue,
    notifications,
  } = useFinancial();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b1120]/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & Family Badge */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => onOpenUserAuth('login')}
            title="Cambiar de usuario o iniciar sesión"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-cyan-500/20 flex-shrink-0 hover:scale-105 transition-transform"
          >
            {user.avatar || 'FM'}
          </button>

          <div className="min-w-0 flex flex-col">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => onOpenUserAuth('login')}
                title="Ver perfil o cambiar usuario"
                className="text-xs sm:text-sm font-black tracking-tight text-slate-100 uppercase truncate hover:text-cyan-400 transition-colors text-left"
              >
                {user.name}
              </button>

              <button
                onClick={onOpenFamily}
                title="Administrar Grupo Familiar y Código de Invitación"
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-bold text-cyan-400 hover:bg-cyan-900/60 transition-colors"
              >
                <Users className="w-3 h-3" />
                <span className="hidden sm:inline">{family.name}</span>
                <span className="font-mono text-[9px] bg-cyan-500/20 px-1 rounded">{family.inviteCode}</span>
              </button>

              <button
                onClick={() => onOpenUserAuth('register')}
                title="Crear un nuevo usuario con validación de correo"
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-[10px] font-extrabold uppercase shadow-sm transition-all"
              >
                <UserPlus className="w-3 h-3" />
                <span>+ Crear Usuario</span>
              </button>

              <button
                onClick={() => onOpenUserAuth('join')}
                title="¿Te compartieron un código? Ingrésalo aquí para unirte a la familia"
                className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-400 text-[10px] font-bold uppercase transition-all"
              >
                <Key className="w-3 h-3" />
                <span>Ingresar Código</span>
              </button>
            </div>

            {/* Live Exchange Rate Badges */}
            <div className="flex items-center gap-2 text-[10px] text-slate-400 overflow-x-auto no-scrollbar pt-0.5">
              <span className="hidden md:inline-flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300">
                <span className="text-emerald-400 font-bold">BCRD:</span> {exchangeRates.BCRD_USD.toFixed(2)}
              </span>
              <span className="hidden lg:inline-flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300">
                <span className="text-amber-400 font-bold">Vimenca:</span> {exchangeRates.VIMENCA_USD.toFixed(2)}
              </span>
              <span className="hidden xl:inline-flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300">
                <span className="text-purple-400 font-bold">EUR:</span> {exchangeRates.EUR_DOP.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Network & Offline sync badge */}
          <button
            onClick={syncOfflineQueue}
            title={isOnline ? 'Conexión activa en tiempo real' : 'Modo sin conexión activo'}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold transition-all ${
              !isOnline
                ? 'bg-rose-950/80 border border-rose-500/40 text-rose-400 animate-pulse'
                : offlineQueue.length > 0
                ? 'bg-amber-950/80 border border-amber-500/40 text-amber-400 cursor-pointer'
                : 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3" />
                <span className="hidden sm:inline">
                  {offlineQueue.length > 0 ? `Sincronizar (${offlineQueue.length})` : 'En Vivo'}
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                <span>Offline</span>
              </>
            )}
          </button>

          {/* Privacy Eye Toggle */}
          <button
            onClick={togglePrivacyMode}
            title={isPrivacyMode ? 'Mostrar montos' : 'Ocultar montos (Modo Privacidad)'}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all ${
              isPrivacyMode
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-sm shadow-amber-500/20'
                : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {isPrivacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Calendar */}
          <button
            onClick={onOpenCalendar}
            title="Calendario Familiar y Vencimientos"
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-all relative"
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* Family Notifications Feed */}
          <button
            onClick={onOpenNotifications}
            title="Notificaciones Familiares"
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Export PDF / Excel */}
          <button
            onClick={onOpenExport}
            title="Exportar Reporte (PDF / Excel)"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Exportar</span>
          </button>

          {/* Automated Tests & Security Suite */}
          <button
            onClick={onOpenTests}
            title="Pruebas Automatizadas de Rendimiento y Seguridad"
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-all"
          >
            <Activity className="w-4 h-4" />
          </button>

          {/* Architecture & Docs */}
          <button
            onClick={onOpenDocs}
            title="Arquitectura y Documentación de Despliegue"
            className="hidden md:flex p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-purple-400 hover:bg-slate-800 transition-all"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Install Mobile / APK Guide */}
          <button
            onClick={onOpenInstall}
            title="Instalar en Móvil / Descargar APK PWA"
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-all"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Biometric / PIN Lock App */}
          <button
            onClick={lockApp}
            title="Bloquear Aplicación (Seguridad Biométrica / PIN)"
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-rose-950 text-rose-400 hover:bg-rose-950/40 transition-all"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
