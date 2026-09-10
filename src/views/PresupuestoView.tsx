import React, { useState } from 'react';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Trash2,
  Calendar,
  Wallet as WalletIcon,
  Tag,
  DollarSign,
  Repeat
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { CurrencyType, TransactionType } from '../types';

export const PresupuestoView: React.FC = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    wallets,
    categories,
    exchangeRates,
    formatMoney,
    isPrivacyMode,
    user
  } = useFinancial();

  // Form State
  const [tipo, setTipo] = useState<TransactionType>('Gasto');
  const [categoria, setCategoria] = useState(categories[0] || 'Alimentación');
  const [concepto, setConcepto] = useState('');
  const [montoInput, setMontoInput] = useState('');
  const [moneda, setMoneda] = useState<CurrencyType>('DOP');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceInterval, setRecurrenceInterval] = useState<'semanal' | 'quincenal' | 'mensual'>('mensual');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Ingreso' | 'Gasto'>('All');
  const [filterWallet, setFilterWallet] = useState('All');

  const selectedWallet = wallets.find(w => w.id === walletId) || wallets[0];

  // Calculate equivalent in DOP
  const numericAmount = parseFloat(montoInput) || 0;
  let computedDOP = numericAmount;
  let appliedRate = 1.0;

  if (moneda === 'USD') {
    appliedRate = exchangeRates.BCRD_USD;
    computedDOP = numericAmount * appliedRate;
  } else if (moneda === 'EUR') {
    appliedRate = exchangeRates.EUR_DOP;
    computedDOP = numericAmount * appliedRate;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concepto.trim() || numericAmount <= 0) return;

    addTransaction({
      tipo,
      categoria,
      concepto: concepto.trim(),
      montoDOP: computedDOP,
      moneda,
      montoOriginal: moneda !== 'DOP' ? numericAmount : undefined,
      tasaCambio: appliedRate,
      walletId: selectedWallet ? selectedWallet.id : '',
      walletNombre: selectedWallet ? selectedWallet.name : 'Cuenta Principal',
      date,
      isRecurring,
      recurrenceInterval: isRecurring ? recurrenceInterval : undefined,
    });

    setConcepto('');
    setMontoInput('');
  };

  // Filtered transactions list
  const filteredList = transactions.filter(t => {
    const matchSearch = t.concepto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.categoria.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === 'All' || t.tipo === filterType;
    const matchWallet = filterWallet === 'All' || t.walletId === filterWallet;
    return matchSearch && matchType && matchWallet;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">
          Presupuesto: Ingresos y Gastos
        </h2>
        <p className="text-xs text-slate-400">
          Registro dinámico con soporte multi-moneda (DOP, USD, EUR) y recurrencia automática
        </p>
      </div>

      {/* New Transaction Form Card */}
      <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-cyan-400" /> Registrar Nuevo Movimiento
          </div>

          {/* Type Toggle Pills */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setTipo('Ingreso')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                tipo === 'Ingreso'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3 h-3" /> Ingreso
            </button>
            <button
              type="button"
              onClick={() => setTipo('Gasto')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                tipo === 'Gasto'
                  ? 'bg-rose-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingDown className="w-3 h-3" /> Gasto
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Amount and Currency */}
            <div className="lg:col-span-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Monto y Moneda
              </label>
              <div className="flex rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <select
                  value={moneda}
                  onChange={(e) => setMoneda(e.target.value as CurrencyType)}
                  className="bg-slate-900 border-r border-slate-800 px-3 py-2 text-xs font-bold text-cyan-400 focus:outline-none"
                >
                  <option value="DOP">RD$ (DOP)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={montoInput}
                  onChange={(e) => setMontoInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent px-3 py-2 text-base font-black text-white font-mono placeholder:text-slate-600 focus:outline-none"
                />
              </div>

              {moneda !== 'DOP' && numericAmount > 0 && (
                <div className="text-[11px] text-cyan-400 font-mono mt-1">
                  Tasa: {appliedRate.toFixed(2)} ➔ Equivalente: <strong>{formatMoney(computedDOP)}</strong>
                </div>
              )}
            </div>

            {/* Concept */}
            <div className="lg:col-span-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Concepto / Detalle
              </label>
              <input
                type="text"
                required
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                placeholder="Ej: Supermercado Bravo, Sueldo Quincena..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Categoría
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Wallet */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Cuenta / Wallet
              </label>
              <select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {wallets.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.currency})
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Fecha
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Recurrence Option */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Recurrencia
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
                />
                <label htmlFor="recurring" className="text-xs text-slate-300">
                  Repetir cada mes
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 ${
              tipo === 'Ingreso'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20'
                : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white shadow-rose-500/20'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Guardar {tipo} de {formatMoney(computedDOP)}</span>
          </button>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0f172a] border border-slate-800 p-3 rounded-2xl">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por concepto o categoría..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="All">Todos los Tipos</option>
            <option value="Ingreso">Solo Ingresos</option>
            <option value="Gasto">Solo Gastos</option>
          </select>

          <select
            value={filterWallet}
            onChange={(e) => setFilterWallet(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="All">Todas las Cuentas</option>
            {wallets.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions History Table */}
      <div className="rounded-2xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 text-xs font-bold text-white uppercase tracking-wider">
          Historial de Movimientos ({filteredList.length})
        </div>

        {filteredList.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No se encontraron transacciones con los filtros seleccionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Concepto & Categoría</th>
                  <th className="p-3">Wallet</th>
                  <th className="p-3 text-right">Monto DOP</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredList.map(tx => {
                  const isInc = tx.tipo === 'Ingreso';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-mono text-slate-400 whitespace-nowrap">{tx.date}</td>
                      <td className="p-3">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{tx.concepto}</span>
                          {tx.isRecurring && (
                            <Repeat className="w-3 h-3 text-cyan-400" title="Recurrente" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">{tx.categoria}</div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="text-cyan-400 font-medium">{tx.walletNombre}</span>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <div
                          className={`font-black font-mono ${
                            isInc ? 'text-emerald-400' : 'text-rose-400'
                          } ${isPrivacyMode ? 'privacy-blur' : ''}`}
                        >
                          {isInc ? '+' : '-'} {formatMoney(tx.montoDOP)}
                        </div>
                        {tx.moneda !== 'DOP' && tx.montoOriginal && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            {tx.moneda} ${tx.montoOriginal.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          title="Eliminar movimiento"
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
