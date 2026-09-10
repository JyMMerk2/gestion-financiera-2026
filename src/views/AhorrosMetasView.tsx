import React, { useState } from 'react';
import {
  PiggyBank,
  Plus,
  Target,
  ArrowUpRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export const AhorrosMetasView: React.FC = () => {
  const {
    savingsFunds,
    wallets,
    depositToFund,
    addSavingsFund,
    formatMoney,
    isPrivacyMode
  } = useFinancial();

  // Deposit modal state
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [sourceWalletId, setSourceWalletId] = useState(wallets[0]?.id || '');

  // New Goal modal state
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalCategory, setGoalCategory] = useState('Vivienda');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalInitial, setGoalInitial] = useState('');
  const [goalDate, setGoalDate] = useState('2026-12-31');

  const selectedFund = savingsFunds.find(f => f.id === selectedFundId);
  const selectedSourceWallet = wallets.find(w => w.id === sourceWalletId);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (!selectedFundId || isNaN(amount) || amount <= 0) return;

    depositToFund(selectedFundId, amount, sourceWalletId || undefined);
    setDepositAmount('');
    setSelectedFundId(null);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(goalTarget);
    const initial = parseFloat(goalInitial) || 0;
    if (!goalName.trim() || isNaN(target) || target <= 0) return;

    addSavingsFund({
      name: goalName.trim(),
      category: goalCategory,
      targetAmountDOP: target,
      currentAmountDOP: initial,
      targetDate: goalDate,
      color: '#8b5cf6',
      icon: '🎯',
    });

    setGoalName('');
    setGoalTarget('');
    setGoalInitial('');
    setShowNewGoalModal(false);
  };

  const totalCurrentSavings = savingsFunds.reduce((acc, f) => acc + f.currentAmountDOP, 0);
  const totalTargetSavings = savingsFunds.reduce((acc, f) => acc + f.targetAmountDOP, 0);
  const overallProgress = totalTargetSavings > 0 ? Math.round((totalCurrentSavings / totalTargetSavings) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">
            Central de Ahorros y Metas
          </h2>
          <p className="text-xs text-slate-400">
            Fondos de reserva, metas familiares y progreso de capitalización
          </p>
        </div>

        <button
          onClick={() => setShowNewGoalModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs font-bold uppercase transition-all shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nueva Meta</span>
        </button>
      </div>

      {/* Overview Progress Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 border border-purple-500/30 p-5 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Acumulado en Metas</div>
            <div
              className={`text-2xl sm:text-3xl font-black text-white font-mono mt-0.5 ${
                isPrivacyMode ? 'privacy-blur' : ''
              }`}
            >
              {formatMoney(totalCurrentSavings)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Meta consolidada: <strong className="text-purple-400">{formatMoney(totalTargetSavings)}</strong>
            </div>
          </div>

          <div className="text-right">
            <span className="text-3xl sm:text-4xl font-black text-purple-400 font-mono">
              {overallProgress}%
            </span>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Completado</span>
          </div>
        </div>

        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {savingsFunds.map(fund => {
          const pct = Math.min(Math.round((fund.currentAmountDOP / fund.targetAmountDOP) * 100), 100);
          const remaining = Math.max(0, fund.targetAmountDOP - fund.currentAmountDOP);

          return (
            <div
              key={fund.id}
              className="rounded-2xl bg-[#0f172a] border border-slate-800 p-5 hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-lg group relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{fund.icon || '🎯'}</span>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                        {fund.name}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">{fund.category}</div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-purple-400 font-mono bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                    {pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 rounded-full h-2 my-3 overflow-hidden border border-slate-800">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs my-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Acumulado</span>
                    <span
                      className={`font-black text-white font-mono ${
                        isPrivacyMode ? 'privacy-blur' : ''
                      }`}
                    >
                      {formatMoney(fund.currentAmountDOP)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Meta Objetivo</span>
                    <span
                      className={`font-black text-slate-300 font-mono ${
                        isPrivacyMode ? 'privacy-blur' : ''
                      }`}
                    >
                      {formatMoney(fund.targetAmountDOP)}
                    </span>
                  </div>
                </div>

                {fund.targetDate && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-2">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    <span>Fecha Límite: <strong className="text-slate-200">{fund.targetDate}</strong></span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="border-t border-slate-800/80 pt-3 mt-4">
                <button
                  onClick={() => {
                    setSelectedFundId(fund.id);
                    setDepositAmount('');
                  }}
                  className="w-full py-2 bg-slate-900 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Hacer Depósito / Aporte</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit to Fund Modal */}
      {selectedFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#0f172a] border border-slate-800 p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
              Aporte al Fondo: {selectedFund.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              El monto se debitará de la cuenta seleccionada y se sumará a esta meta.
            </p>

            <form onSubmit={handleDeposit} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Cuenta de Origen
                </label>
                <select
                  value={sourceWalletId}
                  onChange={(e) => setSourceWalletId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {wallets.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({formatMoney(w.balanceDOP)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Monto del Aporte (RD$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedFundId(null)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                >
                  Confirmar Aporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Goal Modal */}
      {showNewGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0f172a] border border-slate-800 p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
              Nueva Meta de Ahorro
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Crea un fondo dedicado para un proyecto familiar, vehículo, viaje o inversión.
            </p>

            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Nombre de la Meta
                </label>
                <input
                  type="text"
                  required
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="Ej: Cambio de Vehículo, Inicial Casa..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Meta Objetivo (RD$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Saldo Inicial (RD$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={goalInitial}
                    onChange={(e) => setGoalInitial(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Categoría
                  </label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Familia">Familia / Bebé</option>
                    <option value="Vivienda">Vivienda / Solar</option>
                    <option value="Vehículo">Vehículo</option>
                    <option value="Vacaciones">Vacaciones</option>
                    <option value="Emergencia">Emergencia</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Fecha Objetivo
                  </label>
                  <input
                    type="date"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewGoalModal(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                >
                  Guardar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
