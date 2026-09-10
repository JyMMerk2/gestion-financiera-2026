import React, { useState } from 'react';
import {
  X,
  UserPlus,
  LogIn,
  Mail,
  Lock,
  KeyRound,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Send
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { UserRole } from '../types';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'register' | 'login' | 'recover' | 'join';
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'register',
}) => {
  const {
    user,
    registeredUsers,
    registerNewUser,
    loginUser,
    switchActiveUser,
    recoverUserAccount,
    family,
    joinFamilyWithCode,
  } = useFinancial();

  const [mode, setMode] = useState<'register' | 'login' | 'recover' | 'join'>(initialMode);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regConfirmPin, setRegConfirmPin] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('member');
  const [regInviteCode, setRegInviteCode] = useState('');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPin, setLoginPin] = useState('');

  // Recover Form State
  const [recoverEmail, setRecoverEmail] = useState('');

  // Join Form State
  const [joinCode, setJoinCode] = useState('');

  // Feedback State
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string; tempPin?: string } | null>(null);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (regPin !== regConfirmPin) {
      setAlert({ type: 'error', message: 'Los 4 dígitos del PIN no coinciden.' });
      return;
    }

    const res = registerNewUser(regName, regEmail, regPin, regRole, regInviteCode || undefined);
    if (res.success) {
      setAlert({
        type: 'success',
        message: `¡Cuenta creada con éxito! Se ha enviado un correo de bienvenida y verificación a ${regEmail}. Tu usuario y PIN ya están activos.`
      });
      setTimeout(() => {
        onClose();
        setAlert(null);
      }, 2500);
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    const res = loginUser(loginEmail, loginPin);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      setTimeout(() => {
        onClose();
        setAlert(null);
      }, 1000);
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    const res = recoverUserAccount(recoverEmail);
    if (res.success) {
      setAlert({
        type: 'success',
        message: res.message,
        tempPin: res.tempPin
      });
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  const handleJoinFamily = (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    const ok = joinFamilyWithCode(joinCode);
    if (ok) {
      setAlert({
        type: 'success',
        message: `¡Código validado! Te has unido exitosamente al grupo familiar.`
      });
      setJoinCode('');
      setTimeout(() => {
        onClose();
        setAlert(null);
      }, 1500);
    } else {
      setAlert({
        type: 'error',
        message: 'Código inválido o no reconocido. Verifica el formato (ej. FAM-8492-DR).'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-[#0f172a] border border-slate-800 p-5 sm:p-6 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                {mode === 'register' && 'Crear Nuevo Usuario Familiar'}
                {mode === 'login' && 'Iniciar Sesión / Cambiar Cuenta'}
                {mode === 'recover' && 'Recuperar Cuenta por Correo'}
                {mode === 'join' && 'Unirse con Código de Invitación'}
              </h3>
              <p className="text-xs text-slate-400">
                Gestión multiusuario, validación de correo y sincronización familiar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80 mb-4 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => { setMode('register'); setAlert(null); }}
            className={`py-2 rounded-lg transition-all text-center ${
              mode === 'register' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Crear Cuenta
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setAlert(null); }}
            className={`py-2 rounded-lg transition-all text-center ${
              mode === 'login' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ingresar
          </button>
          <button
            type="button"
            onClick={() => { setMode('join'); setAlert(null); }}
            className={`py-2 rounded-lg transition-all text-center ${
              mode === 'join' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tengo Código
          </button>
          <button
            type="button"
            onClick={() => { setMode('recover'); setAlert(null); }}
            className={`py-2 rounded-lg transition-all text-center ${
              mode === 'recover' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Recuperar
          </button>
        </div>

        {/* Alert Feedback */}
        {alert && (
          <div
            className={`mb-4 p-3.5 rounded-xl text-xs flex items-start gap-2.5 border animate-in fade-in ${
              alert.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            {alert.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold">{alert.message}</div>
              {alert.tempPin && (
                <div className="mt-2 p-2 bg-slate-900 rounded-lg border border-slate-700 font-mono text-cyan-400 font-bold">
                  PIN Recuperado: <span className="text-white text-sm">{alert.tempPin}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODE 1: REGISTER NEW USER */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Ej: Pamely Mercado, Juan Mercado..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 flex items-center justify-between">
                <span>Correo Electrónico (Para Validación y Recuperación) *</span>
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="tu.correo@ejemplo.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Este correo se usará para confirmar tu cuenta y recuperar tu usuario/PIN si lo olvidas.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  PIN de Acceso (4 Dígitos) *
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={regPin}
                  onChange={(e) => setRegPin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono text-center tracking-widest focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Confirmar PIN *
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={regConfirmPin}
                  onChange={(e) => setRegConfirmPin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono text-center tracking-widest focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/80 border border-cyan-500/30 p-3 space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> ¿Dónde pongo el código que me compartieron?
              </label>
              <input
                type="text"
                value={regInviteCode}
                onChange={(e) => setRegInviteCode(e.target.value.toUpperCase())}
                placeholder="Pega aquí el código: ej. FAM-8492-DR"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono uppercase tracking-wider focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[10px] text-slate-400">
                Si un familiar te compartió su código, colócalo aquí y tu nuevo usuario quedará automáticamente conectado a su familia. Si lo dejas vacío, te vincularás al grupo actual ({family.name}).
              </p>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Rol Familiar
              </label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="admin">Administrador (Control total)</option>
                <option value="member">Miembro / Cónyuge (Registrar gastos, ingresos y ahorros)</option>
                <option value="contributor">Colaborador (Hijos / Aportes específicos)</option>
                <option value="viewer">Observador (Solo lectura y consulta de balance)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Registrar Usuario y Enviar Confirmación</span>
            </button>
          </form>
        )}

        {/* MODE 2: LOGIN OR SWITCH USER */}
        {mode === 'login' && (
          <div className="space-y-4">
            {/* Quick Switch from local list */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                Usuarios Registrados en este Dispositivo ({registeredUsers.length})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {registeredUsers.map((u) => {
                  const isActive = u.id === user.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        switchActiveUser(u.id);
                        onClose();
                      }}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                        isActive
                          ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-black text-cyan-400">
                        {u.avatar || u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold truncate flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {isActive && (
                            <span className="text-[9px] bg-cyan-500 text-slate-950 px-1 rounded font-extrabold">ACTIVO</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{u.email}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase font-bold">O ingresar con credenciales</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Correo Electrónico o Nombre
                </label>
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="tu.correo@ejemplo.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">
                    PIN de Seguridad (4 Dígitos)
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('recover')}
                    className="text-[10px] text-cyan-400 hover:underline font-medium"
                  >
                    ¿Olvidaste tu PIN?
                  </button>
                </div>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono text-center tracking-widest focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Ingresar a mi Cuenta</span>
              </button>
            </form>
          </div>
        )}

        {/* MODE 3: RECOVER ACCOUNT BY EMAIL */}
        {mode === 'recover' && (
          <form onSubmit={handleRecover} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-300 flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Recuperación Segura por Correo</strong>
                Introduce el correo que registraste al crear la cuenta. El sistema validará tu identidad y enviará la confirmación con tu usuario y código PIN para que vuelvas a tener acceso.
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Correo Electrónico Registrado
              </label>
              <input
                type="email"
                required
                value={recoverEmail}
                onChange={(e) => setRecoverEmail(e.target.value)}
                placeholder="correo.del.usuario@ejemplo.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Confirmación y Recuperar PIN</span>
            </button>
          </form>
        )}

        {/* MODE 4: JOIN EXISTING FAMILY (DÓNDE PONER EL CÓDIGO) */}
        {mode === 'join' && (
          <form onSubmit={handleJoinFamily} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px]">
                <HelpCircle className="w-4 h-4" /> ¿Dónde pongo el código que me compartieron?
              </div>
              <p>
                Si tu cónyuge o familiar te compartió su código privado (por ejemplo: <strong className="text-white font-mono">FAM-8492-DR</strong>), escríbelo en el campo de abajo y presiona <strong>"Unirme a la Familia"</strong>.
              </p>
              <p className="text-[11px] text-slate-400">
                Al hacerlo, tu usuario se vinculará de inmediato al mismo panel financiero y verán las cuentas compartidas en tiempo real.
              </p>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Código de Invitación Privado
              </label>
              <input
                type="text"
                required
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="FAM-XXXX-XX"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-mono text-center uppercase tracking-widest focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Vincularme a esta Familia</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
