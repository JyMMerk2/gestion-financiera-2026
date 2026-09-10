import React, { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { AlertCircle, X, HelpCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginUser, registerNewUser, unlockWithPinOrBiometric, user } = useFinancial();
  const [username, setUsername] = useState<string>('JMERCADO');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  
  // Registration fields
  const [regName, setRegName] = useState<string>('');
  const [regUsername, setRegUsername] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);
  const [regSuccess, setRegSuccess] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('Por favor ingresa tu usuario o correo.');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Por favor ingresa tu contraseña o PIN.');
      return;
    }

    // Standard loginUser checking strictly the user's current credentials
    const res = loginUser(username, password);
    if (res.success) {
      return;
    }

    setErrorMsg(res.message || 'Usuario o contraseña incorrectos.');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }

    if (!regUsername.trim()) {
      setErrorMsg('Por favor ingresa tu correo o usuario.');
      return;
    }

    if (regPassword.trim().length < 4) {
      setErrorMsg('La contraseña o PIN debe contener al menos 4 caracteres.');
      return;
    }

    const emailToUse = regUsername.includes('@') ? regUsername.trim() : `${regUsername.trim().toLowerCase()}@boombah.com`;
    const res = registerNewUser(regName, emailToUse, regPassword);

    if (res.success) {
      setRegSuccess('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
      setUsername(regUsername);
      setPassword(regPassword);
      setIsRegisterMode(false);
      setErrorMsg('');
    } else {
      setErrorMsg(res.message || 'No se pudo crear la cuenta.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f1f5f9] flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-blue-600 selection:text-white">
      <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 max-w-5xl w-full">
        
        {/* Left Side: Form Card */}
        <div className="w-full lg:w-1/2 bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/60 flex flex-col justify-center min-h-[500px]">
          
          {!isRegisterMode ? (
            // LOGIN FORM
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-8 uppercase">
                INICIAR SESIÓN
              </h1>

              {errorMsg && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {regSuccess && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    USUARIO
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="JMERCADO"
                    className="w-full px-4 py-3.5 bg-[#edf4ff] text-slate-800 text-sm font-semibold rounded-xl border border-blue-100/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      CONTRASEÑA
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPassword ? 'Ocultar' : 'Ver'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="PIN o Contraseña"
                      className="w-full px-4 py-3.5 bg-[#edf4ff] text-slate-800 text-sm font-semibold rounded-xl border border-blue-100/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black hover:bg-slate-900 text-white font-black py-4 px-6 rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-[0.99] transition-all cursor-pointer mt-6"
                >
                  INICIAR SESIÓN
                </button>
              </form>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setErrorMsg('');
                    setRegSuccess('');
                  }}
                  className="text-xs text-blue-600 hover:underline font-medium text-left cursor-pointer"
                >
                  ¿No tienes cuenta? Regístrate
                </button>

                <button
                  type="button"
                  onClick={() => setShowSupportModal(true)}
                  className="text-xs text-blue-600 hover:underline font-medium text-left cursor-pointer"
                >
                  ¿Olvidaste tu contraseña? Contacta soporte
                </button>
              </div>
            </div>
          ) : (
            // REGISTER FORM
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-8 uppercase">
                REGISTRARSE
              </h1>

              {errorMsg && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    NOMBRE COMPLETO
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ej. Juan Mercado"
                    className="w-full px-4 py-3 bg-[#edf4ff] text-slate-800 text-sm font-semibold rounded-xl border border-blue-100/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    USUARIO O CORREO
                  </label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="usuario@correo.com o nombre_usuario"
                    className="w-full px-4 py-3 bg-[#edf4ff] text-slate-800 text-sm font-semibold rounded-xl border border-blue-100/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      CONTRASEÑA O PIN
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showRegPassword ? 'Ocultar' : 'Ver'}</span>
                    </button>
                  </div>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Crea un PIN numérico o una contraseña de letras y números"
                    className="w-full px-4 py-3 bg-[#edf4ff] text-slate-800 text-sm font-semibold rounded-xl border border-blue-100/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Puedes elegir un PIN de 4 números o una contraseña completa (mínimo 4 caracteres).
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black hover:bg-slate-900 text-white font-black py-4 px-6 rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-[0.99] transition-all cursor-pointer mt-4"
                >
                  REGISTRARSE
                </button>
              </form>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setErrorMsg('');
                  }}
                  className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
                >
                  ¿Ya tienes cuenta? Inicia sesión
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Visual Image Card */}
        <div className="w-full lg:w-1/2 relative min-h-[460px] sm:min-h-[520px] rounded-3xl overflow-hidden shadow-lg flex flex-col justify-end p-8 sm:p-10 border border-slate-200/50">
          <img
            src="/login-bg.jpg"
            alt="Gestión Financiera"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

          {/* Overlay Info */}
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl mb-4">
              MR
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-2">
              Gestión Financiera
            </h2>
            <p className="text-xs sm:text-sm text-slate-200/90 font-medium max-w-sm">
              Gestiona tus finanzas de manera eficiente y segura.
            </p>
          </div>
        </div>

      </div>

      {/* Support / Password Recovery Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowSupportModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-2">
              Recuperar Acceso y Soporte
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Si olvidaste tu contraseña o necesitas restablecer tus credenciales de acceso, puedes solicitar asistencia técnica al administrador del sistema:
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Correo de Soporte:
              <br />
              <strong className="text-blue-600 font-bold">juan.mercado@dr.boombah.com</strong>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSupportModal(false)}
                className="w-full py-3 px-4 rounded-xl bg-black hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
