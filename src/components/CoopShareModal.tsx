import React, { useState } from 'react';
import { X, TrendingUp, Check } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { CoopShare } from '../types';

interface CoopShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCoop: CoopShare | null;
}

export const CoopShareModal: React.FC<CoopShareModalProps> = ({
  isOpen,
  onClose,
  selectedCoop
}) => {
  const { updateCoopShare, formatMoney } = useFinancial();
  const [newAmount, setNewAmount] = useState(selectedCoop ? String(selectedCoop.montoDOP) : '');

  if (!isOpen || !selectedCoop) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(newAmount);
    if (isNaN(num) || num < 0) return;

    updateCoopShare(selectedCoop.id, num);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-2xl bg-[#0f172a] border border-slate-800 p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider truncate">
                {selectedCoop.coopName}
              </h3>
              <p className="text-xs text-slate-400">Actualizar Acciones e Inversión</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Monto Actual Registrado</span>
            <span className="text-base font-black text-amber-400 font-mono">
              {formatMoney(selectedCoop.montoDOP)}
            </span>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Nuevo Balance Total en Acciones (RD$)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Guardar Nuevo Balance</span>
          </button>
        </form>
      </div>
    </div>
  );
};
