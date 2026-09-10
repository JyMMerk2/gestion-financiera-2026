import React, { useState, useEffect } from 'react';
import { X, Smartphone, Download, CheckCircle2, Apple, PlayCircle, ShieldCheck } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instructions
      alert('Para instalar la aplicación en Android o PC:\n1. Toca los tres puntos del navegador (⋮)\n2. Selecciona "Instalar aplicación" o "Agregar a pantalla principal".');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-[#0f172a] border border-slate-800 p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Instalar Aplicación (Android / iOS / PC)
              </h3>
              <p className="text-xs text-slate-400">PWA nativa con modo offline y acceso directo sin tienda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action button if prompt is available */}
        <div className="rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 p-4 mb-5 text-center">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
            Instalación Instantánea en 1 Clic
          </h4>
          <p className="text-[11px] text-slate-400 mb-3">
            Convierte esta app web en una app instalada en tu teléfono con ícono propio y pantalla completa.
          </p>
          <button
            onClick={handleInstallClick}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{isInstalled ? 'App Ya Instalada' : 'Instalar APK / App Móvil Ahora'}</span>
          </button>
        </div>

        {/* Platform instructions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Android */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase mb-2">
              <PlayCircle className="w-4 h-4" /> Android (APK Web)
            </div>
            <ol className="text-[11px] text-slate-400 space-y-1.5 list-decimal pl-4">
              <li>Abre el menú de Chrome (3 puntos arriba a la derecha).</li>
              <li>Toca <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.</li>
              <li>Se generará el archivo WebAPK con soporte offline automático.</li>
            </ol>
          </div>

          {/* iOS */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase mb-2">
              <Apple className="w-4 h-4" /> iPhone / iPad (iOS)
            </div>
            <ol className="text-[11px] text-slate-400 space-y-1.5 list-decimal pl-4">
              <li>Abre la aplicación en el navegador <strong>Safari</strong>.</li>
              <li>Toca el botón <strong>Compartir</strong> (icono con la flecha hacia arriba).</li>
              <li>Desliza y selecciona <strong>"Agregar a pantalla de inicio"</strong>.</li>
            </ol>
          </div>
        </div>

        <div className="mt-4 text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cumple con los estándares W3C PWA y almacenamiento offline IndexedDB</span>
        </div>
      </div>
    </div>
  );
};
