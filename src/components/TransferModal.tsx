import React, { useState } from 'react';
import { X, ArrowRightLeft, Send } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSourceWalletId?: string;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  defaultSourceWalletId
}) => {
  const { wallets, transferWalletFunds, formatMoney } = useFinancial();
  const [sourceId, setSourceId] = useState(defaultSourceWalletId || (wallets[0]?.id ?? ''));
  const [destId, setDestId] = useState(wallets[1]?.id || (wallets[0]?.id ?? ''));
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');

  if (!isOpen) return null;

  const sourceWallet = wallets.find(w => w.id === sourceId);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0 || sourceId === destId) return;

    transferWalletFunds(sourceId, destId, num, concept.trim() || undefined);
    setAmount('');
    setConcept('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-[#0f172a] border border-slate-800 p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Transferir Entre Wallets
              </h3>
              <p className="text-xs text-slate-400">Movimiento de fondos entre cuentas bancarias</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Cuenta de Origen</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {wallets.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name} — Balance: {formatMoney(w.balanceDOP)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Cuenta de Destino</label>
            <select
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {wallets.filter(w => w.id !== sourceId).map(w => (
                <option key={w.id} value={w.id}>
                  {w.name} — Balance: {formatMoney(w.balanceDOP)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Monto a Transferir (RD$)</label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              max={sourceWallet ? sourceWallet.balanceDOP : undefined}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {sourceWallet && (
              <span className="text-[10px] text-slate-400 mt-1 block">
                Disponible en origen: <strong className="text-cyan-400">{formatMoney(sourceWallet.balanceDOP)}</strong>
              </span>
            )}
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Concepto / Motivo</label>
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Ej: Para cubrir cuota, ahorro temporal..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Confirmar Transferencia</span>
          </button>
        </form>
      </div>
    </div>
  );
};
