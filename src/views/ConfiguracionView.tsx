import React, { useState } from 'react';
import {
  Shield,
  Fingerprint,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Users,
  RotateCcw
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export const ConfiguracionView: React.FC = () => {
  const {
    user,
    setUser,
    family,
    exchangeRates,
    setExchangeRates,
    changePassword,
    resetUserDataToZero,
    resetAllData,
  } = useFinancial();

  const [copied, setCopied] = useState(false);

  // Password Change Flow State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Exchange rate & reset feedback
  const [usdRate, setUsdRate] = useState(String(exchangeRates.BCRD_USD));
  const [rateSuccess, setRateSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(family.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    const currentClean = currentPassword.trim();
    const newClean = newPassword.trim();
    const confirmClean = confirmPassword.trim();

    if (!currentClean || !newClean || !confirmClean) {
      setPasswordError('Por favor completa los tres campos para cambiar tu clave.');
      return;
    }

    if (newClean.length < 4) {
      setPasswordError('La nueva contraseña debe tener al menos 4 caracteres (pueden ser números, letras o ambos).');
      return;
    }

    if (newClean !== confirmClean) {
      setPasswordError('La nueva contraseña y la confirmación no coinciden.');
      return;
    }

    const res = changePassword(currentClean, newClean);
    if (!res.success) {
      setPasswordError(res.message);
    } else {
      setPasswordSuccess(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 4000);
    }
  };

  const handleToggleBiometric = () => {
    setUser(prev => ({ ...prev, biometricEnabled: !prev.biometricEnabled }));
  };

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(usdRate);
    if (!isNaN(rate) && rate > 0) {
      setExchangeRates(prev => ({
        ...prev,
        BCRD_USD: rate,
        VIMENCA_USD: parseFloat((rate + 0.15).toFixed(2)),
      }));
      setRateSuccess(true);
      setTimeout(() => setRateSuccess(false), 3000);
    }
  };

  const handleResetToZero = () => {
    if (window.confirm('¿Deseas reiniciar tu cuenta a 0? Se pondrán en 0.00 todos los saldos de tus billeteras y se eliminarán transacciones para iniciar desde cero.')) {
      resetUserDataToZero();
      setResetSuccess('¡Cuenta reiniciada a 0.00 DOP con éxito!');
      setTimeout(() => setResetSuccess(null), 3500);
    }
  };

  const handleResetData = () => {
    if (window.confirm('¿Seguro que deseas restaurar la base de datos completa a los valores de prueba iniciales?')) {
      resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">
          Configuración y Seguridad
        </h2>
        <p className="text-xs text-slate-400">
          Ajustes de privacidad, cambio de contraseña/PIN, tasas de cambio y grupo familiar
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

          {/* Change Password / PIN Form with 3 Fields */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <label className="text-xs uppercase font-bold text-white block">
                Cambiar Contraseña o PIN
              </label>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Puedes elegir un PIN de 4 números o una contraseña segura (letras, números y símbolos).
            </p>

            <form onSubmit={handleChangePassword} className="space-y-3 pt-1">
              {/* Field 1: Current Password */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                  <span>1. Contraseña o PIN Actual</span>
                  <span className="text-[9px] text-slate-500 lowercase">requerido</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Escribe tu clave actual"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-9 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Field 2: New Password */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                  <span>2. Nueva Contraseña o PIN</span>
                  <span className="text-[9px] text-slate-500 lowercase">mínimo 4 caracteres</span>
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Escribe tu nueva clave o PIN"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-9 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Field 3: Confirm New Password */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                  <span>3. Confirmar Nueva Contraseña o PIN</span>
                  {newPassword && confirmPassword && (
                    <span className={newPassword === confirmPassword ? 'text-emerald-400 text-[9px]' : 'text-rose-400 text-[9px]'}>
                      {newPassword === confirmPassword ? '✓ Coinciden' : '✗ No coinciden'}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la nueva clave o PIN"
                    className={`w-full bg-slate-950 border rounded-xl pl-3 pr-9 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none ${
                      confirmPassword && newPassword !== confirmPassword
                        ? 'border-rose-500/70 focus:border-rose-500'
                        : 'border-slate-800 focus:border-cyan-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}

              {/* Success Message */}
              {passwordSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!currentPassword || !newPassword || !confirmPassword}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 disabled:opacity-40 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-1"
              >
                Actualizar Contraseña
              </button>
            </form>
          </div>
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
              ¿Dónde se introduce este código de invitación?
            </span>
            <span>
              Cualquier familiar o nuevo usuario puede ir a la pantalla de Inicio de Sesión, presionar <strong>"Registrar Cuenta"</strong>, marcar la casilla <strong>"Tengo un código familiar"</strong> y pegar este código. Su cuenta iniciará limpia en 0.00 DOP y se integrará a tu grupo familiar automáticamente.
            </span>
          </div>
        </div>

        {/* Exchange Rates Card */}
        <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Tasas de Cambio de Referencia</span>
          </div>

          <p className="text-xs text-slate-400">
            Se sincroniza automáticamente con el mercado. Puedes fijar manualmente la tasa oficial del Banco Central de la RD (BCRD).
          </p>

          <form onSubmit={handleSaveRate} className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 block">
              Tasa BCRD (DOP por 1 USD)
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
            {rateSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Tasa actualizada correctamente
              </span>
            )}
          </form>
        </div>

        {/* Reset / Clean Database Card */}
        <div className="rounded-2xl bg-[#0f172a] border border-rose-950/60 p-5 shadow-xl space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Trash2 className="w-4 h-4" />
            <span>Zona de Reinicio de Almacenamiento</span>
          </div>
          
          {resetSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{resetSuccess}</span>
            </div>
          )}

          {/* Option 1: Clean account data to 0 */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Limpiar datos de esta cuenta (Poner todo en 0)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Pone en 0.00 DOP los saldos de tus billeteras y limpia transacciones, préstamos y fondos para empezar tu registro desde cero.
            </p>
            <button
              onClick={handleResetToZero}
              className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              Reiniciar Mi Cuenta a 0.00 DOP
            </button>
          </div>

          {/* Option 2: Restore full demo database */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-300">
              Restaurar Base de Datos Local Completa
            </div>
            <p className="text-[11px] text-slate-400">
              Restaura la aplicación al estado original de prueba demo de la Familia Mercado.
            </p>
            <button
              onClick={handleResetData}
              className="w-full py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              Restaurar Base de Datos de Fábrica
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
