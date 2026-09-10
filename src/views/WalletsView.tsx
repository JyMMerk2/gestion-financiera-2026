import React, { useState } from 'react';
import {
  CreditCard,
  ArrowRightLeft,
  RefreshCw,
  Plus,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Building
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

interface WalletsViewProps {
  onOpenTransfer: (walletId?: string) => void;
}

export const WalletsView: React.FC<WalletsViewProps> = ({ onOpenTransfer }) => {
  const { wallets, formatMoney, isPrivacyMode } = useFinancial();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Bank sync simulation
  const handleBankSync = () => {
    setIsSyncing(true);
    setSyncStatus('Conectando de forma segura con APIs bancarias (Banreservas, BHD, Popular)...');

    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('¡Cuentas bancarias sincronizadas con éxito! Balances actualizados.');
      setTimeout(() => setSyncStatus(null), 4000);
    }, 1800);
  };

  const totalLiquid = wallets.reduce((acc, w) => acc + w.balanceDOP, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">
            Wallets y Cuentas Bancarias
          </h2>
          <p className="text-xs text-slate-400">
            Administración multi-cuenta con transferencias instantáneas y sincronización segura
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBankSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-xs font-bold text-cyan-300 transition-all shadow"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Bancos'}</span>
          </button>

          <button
            onClick={() => onOpenTransfer()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black uppercase transition-all shadow"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Transferir</span>
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Total Liquid Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Liquidéz Disponible (Todas las Cuentas)</div>
          <div
            className={`text-2xl sm:text-3xl font-black text-white font-mono mt-1 ${
              isPrivacyMode ? 'privacy-blur' : ''
            }`}
          >
            {formatMoney(totalLiquid)}
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <CreditCard className="w-6 h-6" />
        </div>
      </div>

      {/* Wallets Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map(w => (
          <div
            key={w.id}
            className="rounded-2xl bg-[#0f172a] border border-slate-800 p-5 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{w.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {w.name}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono">{w.accountNumber || 'Cuenta Vista'}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-cyan-400">
                  {w.currency}
                </span>
              </div>

              <div className="my-4">
                <div className="text-[10px] uppercase font-bold text-slate-400">Balance Contable</div>
                <div
                  className={`text-xl font-black text-white font-mono mt-0.5 ${
                    isPrivacyMode ? 'privacy-blur' : ''
                  }`}
                >
                  {formatMoney(w.balanceDOP)}
                </div>
                {w.currency !== 'DOP' && w.balanceOriginal !== undefined && (
                  <div className="text-xs text-cyan-400 font-mono mt-1">
                    Balance Original: <strong>{w.currency} ${w.balanceOriginal.toFixed(2)}</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verificada
              </span>
              <button
                onClick={() => onOpenTransfer(w.id)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
              >
                <ArrowRightLeft className="w-3 h-3" /> Mover Fondos
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
