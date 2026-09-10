import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Fingerprint,
  KeyRound,
  Eye,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  Trash2,
  Users,
  DollarSign
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export const ConfiguracionView: React.FC = () => {
  const {
    user,
    setUser,
    family,
    generateNewInviteCode,
    exchangeRates,
    setExchangeRates,
  } = useFinancial();

  const [copied, setCopied] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [usdRate, setUsdRate] = useState(String(exchangeRates.BCRD_USD));

  const handleCopy = () => {
    navigator.clipboard.writeText(family.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newPin.trim();
    if (clean.length >= 4) {
      setUser(prev => ({ ...prev, pinCode: clean, password: clean }));
      setPinSuccess(true);
      setNewPin('');
      setTimeout(() => setPinSuccess(false), 3000);
    }
  };

  const handleToggleBiometric = () => {
    setUser(prev => ({ ...prev, biometricEnabled: !prev.biometricEnabled }));
  };

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(usdRate);
    if (!isNaN(rate) && rate > 0) {
      setExchangeRates(prev => ({ ...prev, BCRD_USD: rate }));
    }
  };

  const handleResetData = () => {
    if (window.confirm('¿Seguro que deseas reiniciar todos los datos locales al estado de fábrica inicial?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">
          Configuración y Seguridad
        </h2>
        <p className="text-xs text-slate-400">
          Ajustes de privacidad, autenticación biométrica, claves de acceso y familia
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Security & Biometric Card */}
        <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Seguridad Biométrica y Bóveda</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-3">
              <Fingerprint className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-xs font-bold text-white">Desbloqueo con Huella / FaceID</div>
                <div className="text-[10px] text-slate-400">Autenticación rápida de inicio de sesión</div>
              </div>
            </div>
            <button
              onClick={handleToggleBiometric}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                user.biometricEnabled ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 ${
                  user.biometricEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Change Password / PIN */}
          <form onSubmit={handleSavePin} className="space-y-2.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 block">
              Cambiar Clave de Acceso (PIN o Contraseña)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Nuevo PIN numérico o contraseña (ej: 5678 o MiClave2026)"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={newPin.trim().length < 4}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase rounded-xl transition-all"
              >
                Actualizar
              </button>
            </div>
            {pinSuccess && (
              <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Clave actualizada correctamente
              </div>
            )}
            <span className="text-[10px] text-slate-500 block">
              Puedes configurar un PIN de 4 números o una contraseña segura con letras y números (mínimo 4 caracteres).
            </span>
          </form>
        </div>

        {/* Family Group Card */}
        <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Grupo Familiar ({family.name})</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Código Privado de Invitación
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-base font-black text-cyan-400 tracking-wider">
                {family.inviteCode}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase transition-all shadow"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-400">
            <div>
              Usuario activo: <strong className="text-white">{user.name}</strong> ({user.email})
            </div>
            <div>
              Rol en la familia: <strong className="text-cyan-400 uppercase">{user.role}</strong>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-slate-300">
            <span className="text-cyan-400 font-bold block mb-1">
              ¿A la persona que le compartas el código, dónde lo pone?
            </span>
            <span>
              La otra persona solo debe abrir la aplicación en su celular o navegador, presionar el botón <strong>"+ Crear Usuario"</strong> o <strong>"Ingresar Código"</strong> en la barra superior, y pegar tu código <strong className="text-cyan-300 font-mono">{family.inviteCode}</strong>. Al instante quedarán vinculados al mismo grupo familiar.
            </span>
          </div>
        </div>

        {/* Exchange Rate Adjustment Card */}
        <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Tasas de Cambio de Referencia</span>
          </div>

          <form onSubmit={handleSaveRate} className="space-y-2.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 block">
              Tasa Oficial USD / DOP (Banco Central RD)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                value={usdRate}
                onChange={(e) => setUsdRate(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase rounded-xl transition-all"
              >
                Guardar Tasa
              </button>
            </div>
          </form>
        </div>

        {/* Reset / Clean Database Card */}
        <div className="rounded-2xl bg-[#0f172a] border border-rose-950/60 p-5 shadow-xl space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Trash2 className="w-4 h-4" />
            <span>Zona de Reinicio de Almacenamiento</span>
          </div>
          <p className="text-xs text-slate-400">
            Restaura la aplicación al estado original de prueba. Todos los datos en memoria local y caché offline serán limpiados.
          </p>
          <button
            onClick={handleResetData}
            className="w-full py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            Restaurar Base de Datos Local
          </button>
        </div>
      </div>
    </div>
  );
};
