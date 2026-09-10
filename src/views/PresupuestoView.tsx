import React, { useState, useMemo } from 'react';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Search,
  Trash2,
  Calendar,
  Wallet as WalletIcon,
  Tag,
  DollarSign,
  Repeat,
  PieChart,
  CheckCircle2,
  AlertCircle,
  Settings,
  Layers,
  Sparkles
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { CurrencyType, TransactionType, Category } from '../types';

export const PresupuestoView: React.FC = () => {
  const {
    transactions = [],
    addTransaction,
    deleteTransaction,
    wallets = [],
    categories = [],
    addCategory,
    updateCategoryBudget,
    exchangeRates,
    formatMoney,
    isPrivacyMode,
    user
  } = useFinancial();

  // Selected period / month filter
  const currentMonthPrefix = new Date().toISOString().substring(0, 7); // e.g. "2026-08" or "2026-09"
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthPrefix);

  // Form State
  const [tipo, setTipo] = useState<TransactionType>('Gasto');
  const [concepto, setConcepto] = useState('');
  const [montoInput, setMontoInput] = useState('');
  const [moneda, setMoneda] = useState<CurrencyType>('DOP');
  const [walletId, setWalletId] = useState<string>(() => wallets[0]?.id || '');
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceInterval, setRecurrenceInterval] = useState<'semanal' | 'quincenal' | 'mensual'>('mensual');

  // New category creation modal / inline state
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🏷️');
  const [newCatType, setNewCatType] = useState<'ingreso' | 'gasto'>('gasto');
  const [newCatBudget, setNewCatBudget] = useState('');

  // Edit budget modal state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [budgetEditAmount, setBudgetEditAmount] = useState('');

  // Active view sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'movimientos' | 'presupuesto'>('movimientos');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Ingreso' | 'Gasto'>('All');
  const [filterWallet, setFilterWallet] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  // Normalize categories: always return an object { id, name, icon, type, budgetMonthly }
  const normalizedCategories: Category[] = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    return categories.map((c, index) => {
      if (typeof c === 'string') {
        return {
          id: `cat-str-${index}`,
          name: c,
          icon: '🏷️',
          type: 'gasto' as const,
        };
      }
      return {
        id: c.id || `cat-${index}`,
        name: c.name || 'Sin Categoría',
        icon: c.icon || '🏷️',
        type: c.type || 'gasto',
        budgetMonthly: typeof c.budgetMonthly === 'number' ? c.budgetMonthly : undefined,
      };
    });
  }, [categories]);

  // Categories filtered by the active transaction type (Ingreso vs Gasto)
  const availableCategories = useMemo(() => {
    const targetType = tipo === 'Ingreso' ? 'ingreso' : 'gasto';
    const filtered = normalizedCategories.filter(c => c.type === targetType || (c.type as string) === 'ambos');
    return filtered.length > 0 ? filtered : normalizedCategories;
  }, [normalizedCategories, tipo]);

  // Selected category in the form
  const [categoriaName, setCategoriaName] = useState<string>(() => {
    const first = normalizedCategories.find(c => c.type === 'gasto') || normalizedCategories[0];
    return first?.name || 'Comida & Supermercado';
  });

  // Keep category in sync when switching between Ingreso and Gasto if not valid
  const handleTypeChange = (newType: TransactionType) => {
    setTipo(newType);
    const targetType = newType === 'Ingreso' ? 'ingreso' : 'gasto';
    const firstMatching = normalizedCategories.find(c => c.type === targetType || (c.type as string) === 'ambos');
    if (firstMatching) {
      setCategoriaName(firstMatching.name);
    }
  };

  // Safe wallet selection
  const activeWalletId = walletId || wallets[0]?.id || '';
  const selectedWallet = wallets.find(w => w.id === activeWalletId) || wallets[0];

  // Calculate equivalent in DOP
  const numericAmount = parseFloat(montoInput) || 0;
  let computedDOP = numericAmount;
  let appliedRate = 1.0;

  const rateUSD = exchangeRates?.BCRD_USD || 58.71;
  const rateEUR = exchangeRates?.EUR_DOP || 68.48;

  if (moneda === 'USD') {
    appliedRate = rateUSD;
    computedDOP = numericAmount * appliedRate;
  } else if (moneda === 'EUR') {
    appliedRate = rateEUR;
    computedDOP = numericAmount * appliedRate;
  }

  // Handle transaction submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concepto.trim() || numericAmount <= 0) return;

    addTransaction({
      tipo,
      categoria: categoriaName,
      concepto: concepto.trim(),
      montoDOP: computedDOP,
      moneda,
      montoOriginal: moneda !== 'DOP' ? numericAmount : undefined,
      tasaCambio: appliedRate,
      walletId: selectedWallet ? selectedWallet.id : 'w-default',
      walletNombre: selectedWallet ? selectedWallet.name : 'Cuenta Principal',
      date,
      isRecurring,
      recurrenceInterval: isRecurring ? recurrenceInterval : undefined,
    });

    setConcepto('');
    setMontoInput('');
  };

  // Handle adding new custom category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const budgetVal = parseFloat(newCatBudget);
    addCategory({
      name: newCatName.trim(),
      icon: newCatIcon.trim() || '🏷️',
      type: newCatType,
      budgetMonthly: !isNaN(budgetVal) && budgetVal > 0 ? budgetVal : undefined,
    });

    setCategoriaName(newCatName.trim());
    setNewCatName('');
    setNewCatBudget('');
    setShowNewCategoryModal(false);
  };

  // Handle saving updated budget for a category
  const handleSaveCategoryBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    const newBudget = parseFloat(budgetEditAmount);
    if (!isNaN(newBudget) && newBudget >= 0) {
      updateCategoryBudget(editingCategory.id, newBudget);
    }
    setEditingCategory(null);
    setBudgetEditAmount('');
  };

  // Filtered transactions for the selected month and search criteria
  const currentMonthTransactions = useMemo(() => {
    return transactions.filter(t => {
      const txDate = t.date || '';
      return selectedMonth === 'All' || txDate.startsWith(selectedMonth);
    });
  }, [transactions, selectedMonth]);

  const filteredList = useMemo(() => {
    return currentMonthTransactions.filter(t => {
      const conceptStr = (t.concepto || '').toLowerCase();
      const catStr = (t.categoria || '').toLowerCase();
      const queryStr = searchQuery.toLowerCase();

      const matchSearch = conceptStr.includes(queryStr) || catStr.includes(queryStr);
      const matchType = filterType === 'All' || t.tipo === filterType;
      const matchWallet = filterWallet === 'All' || t.walletId === filterWallet;
      const matchCat = filterCategory === 'All' || t.categoria === filterCategory;

      return matchSearch && matchType && matchWallet && matchCat;
    });
  }, [currentMonthTransactions, searchQuery, filterType, filterWallet, filterCategory]);

  // Monthly summary calculations
  const totalIngresos = useMemo(() => {
    return currentMonthTransactions
      .filter(t => t.tipo === 'Ingreso')
      .reduce((acc, t) => acc + (t.montoDOP || 0), 0);
  }, [currentMonthTransactions]);

  const totalGastos = useMemo(() => {
    return currentMonthTransactions
      .filter(t => t.tipo === 'Gasto')
      .reduce((acc, t) => acc + (t.montoDOP || 0), 0);
  }, [currentMonthTransactions]);

  const balanceNeto = totalIngresos - totalGastos;

  // Expense categories budget progress
  const expenseCategoriesProgress = useMemo(() => {
    const expenseCats = normalizedCategories.filter(c => c.type === 'gasto');
    return expenseCats.map(cat => {
      const spent = currentMonthTransactions
        .filter(t => t.tipo === 'Gasto' && t.categoria?.toLowerCase() === cat.name?.toLowerCase())
        .reduce((sum, t) => sum + (t.montoDOP || 0), 0);
      const budget = cat.budgetMonthly || 0;
      const pct = budget > 0 ? (spent / budget) * 100 : 0;
      return {
        ...cat,
        spent,
        budget,
        pct: Math.min(pct, 200), // cap at 200% for bar drawing
        realPct: pct,
        isOver: budget > 0 && spent > budget,
      };
    });
  }, [normalizedCategories, currentMonthTransactions]);

  const totalBudgetedExpenses = useMemo(() => {
    return expenseCategoriesProgress.reduce((sum, c) => sum + c.budget, 0);
  }, [expenseCategoriesProgress]);

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
              <PieChart className="w-5 h-5 text-cyan-400" /> Presupuesto & Movimientos
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Multi-Moneda (DOP, USD, EUR)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Control de ingresos, gastos categorizados y límites de presupuesto familiar mensual
          </p>
        </div>

        {/* Period Selector & Sub-Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveSubTab('movimientos')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'movimientos'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Movimientos ({currentMonthTransactions.length})
            </button>
            <button
              onClick={() => setActiveSubTab('presupuesto')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'presupuesto'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Control de Presupuesto
            </button>
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
            <input
              type="month"
              value={selectedMonth === 'All' ? currentMonthPrefix : selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-white font-mono text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Ingresos */}
        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <TrendingUp className="w-4 h-4" /> Ingresos del Mes
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {currentMonthTransactions.filter(t => t.tipo === 'Ingreso').length} registros
            </span>
          </div>
          <div className={`text-xl font-black text-emerald-400 font-mono ${isPrivacyMode ? 'privacy-blur' : ''}`}>
            + {formatMoney(totalIngresos)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Entradas netas registradas en el período
          </div>
        </div>

        {/* Total Gastos */}
        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1.5 text-rose-400">
              <TrendingDown className="w-4 h-4" /> Gastos del Mes
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {currentMonthTransactions.filter(t => t.tipo === 'Gasto').length} registros
            </span>
          </div>
          <div className={`text-xl font-black text-rose-400 font-mono ${isPrivacyMode ? 'privacy-blur' : ''}`}>
            - {formatMoney(totalGastos)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Salidas y consumos reportados
          </div>
        </div>

        {/* Balance Neto */}
        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <DollarSign className="w-4 h-4" /> Balance Neto
            </span>
            <span className={`text-[10px] font-bold ${balanceNeto >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {balanceNeto >= 0 ? 'Superávit' : 'Déficit'}
            </span>
          </div>
          <div className={`text-xl font-black font-mono ${balanceNeto >= 0 ? 'text-white' : 'text-rose-400'} ${isPrivacyMode ? 'privacy-blur' : ''}`}>
            {formatMoney(balanceNeto)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Margen disponible tras cubrir gastos
          </div>
        </div>

        {/* Presupuesto Total */}
        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1.5 text-amber-400">
              <PieChart className="w-4 h-4" /> Presupuesto Global
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {totalBudgetedExpenses > 0
                ? `${Math.round((totalGastos / totalBudgetedExpenses) * 100)}% usado`
                : 'Sin límite'}
            </span>
          </div>
          <div className={`text-xl font-black text-amber-400 font-mono ${isPrivacyMode ? 'privacy-blur' : ''}`}>
            {formatMoney(totalBudgetedExpenses)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Tope mensual planificado en categorías
          </div>
        </div>
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
              onClick={() => handleTypeChange('Ingreso')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                tipo === 'Ingreso'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" /> Ingreso (+)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('Gasto')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                tipo === 'Gasto'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" /> Gasto (-)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Amount and Currency */}
            <div className="lg:col-span-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Monto y Moneda <span className="text-rose-400">*</span>
              </label>
              <div className="flex rounded-xl overflow-hidden border border-slate-800 bg-slate-950 focus-within:border-cyan-500 transition-colors">
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
                  min="0.01"
                  required
                  value={montoInput}
                  onChange={(e) => setMontoInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent px-3 py-2 text-base font-black text-white font-mono placeholder:text-slate-600 focus:outline-none"
                />
              </div>

              {moneda !== 'DOP' && numericAmount > 0 && (
                <div className="text-[11px] text-cyan-400 font-mono mt-1 flex items-center gap-1">
                  <span>Tasa {moneda}: {appliedRate.toFixed(2)}</span>
                  <span>➔</span>
                  <span>Equivalente: <strong>{formatMoney(computedDOP)}</strong></span>
                </div>
              )}
            </div>

            {/* Concept */}
            <div className="lg:col-span-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Concepto / Descripción <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                placeholder={tipo === 'Ingreso' ? 'Ej: Sueldo Quincena, Bono de Ventas, Trabajo Freelance...' : 'Ej: Supermercado Bravo, Pago Internet Claro, Gasolina...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Category selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">
                  Categoría ({tipo === 'Ingreso' ? 'Ingresos' : 'Gastos'})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setNewCatType(tipo === 'Ingreso' ? 'ingreso' : 'gasto');
                    setShowNewCategoryModal(true);
                  }}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" /> Crear
                </button>
              </div>
              <select
                value={categoriaName}
                onChange={(e) => setCategoriaName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {availableCategories.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Wallet Selection */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Cuenta / Billetera
              </label>
              <select
                value={activeWalletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {wallets.length === 0 ? (
                  <option value="w-default">Cuenta Principal (RD$ 0.00)</option>
                ) : (
                  wallets.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.icon || '🏦'} {w.name} — {formatMoney(w.balanceDOP || 0)} ({w.currency})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Fecha del Movimiento
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Recurrence Option */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Recurrencia (Opcional)
              </label>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="recurring" className="text-xs text-slate-300 cursor-pointer select-none">
                  Frecuencia automática
                </label>
                {isRecurring && (
                  <select
                    value={recurrenceInterval}
                    onChange={(e) => setRecurrenceInterval(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-xs text-cyan-400 ml-auto"
                  >
                    <option value="semanal">Semanal</option>
                    <option value="quincenal">Quincenal</option>
                    <option value="mensual">Mensual</option>
                  </select>
                )}
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

      {/* Sub-Tab 1: Control de Presupuesto por Categoría */}
      {activeSubTab === 'presupuesto' && (
        <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <PieChart className="w-4 h-4 text-cyan-400" /> Presupuestos Mensuales por Categoría
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Define límites de gasto por categoría para alertarte antes de sobrepasar tu capacidad financiera
              </p>
            </div>
            <button
              onClick={() => {
                setNewCatType('gasto');
                setShowNewCategoryModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Nueva Categoría
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {expenseCategoriesProgress.map(cat => {
              const hasBudget = cat.budget > 0;
              const isOver = cat.isOver;
              const pctText = hasBudget ? `${Math.round(cat.realPct)}%` : 'Sin límite';

              return (
                <div
                  key={cat.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isOver
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-xs font-bold text-white truncate">{cat.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setBudgetEditAmount(cat.budget ? String(cat.budget) : '');
                      }}
                      title="Modificar límite de presupuesto"
                      className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-900 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-baseline justify-between text-xs mb-1.5">
                    <span className={`font-mono font-bold ${isOver ? 'text-rose-400' : 'text-slate-200'}`}>
                      {formatMoney(cat.spent)}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      / {hasBudget ? formatMoney(cat.budget) : 'Sin asignar'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all rounded-full ${
                        isOver
                          ? 'bg-rose-500'
                          : cat.pct > 75
                          ? 'bg-amber-400'
                          : 'bg-cyan-500'
                      }`}
                      style={{ width: `${Math.min(cat.pct, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                    <span>Consumo: <strong className={isOver ? 'text-rose-400 font-bold' : 'text-slate-300'}>{pctText}</strong></span>
                    {hasBudget && (
                      <span>
                        {isOver ? (
                          <span className="text-rose-400 font-bold">Excedido por {formatMoney(cat.spent - cat.budget)}</span>
                        ) : (
                          <span className="text-emerald-400">Disponible: {formatMoney(cat.budget - cat.spent)}</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Historial de Transacciones */}
      {activeSubTab === 'movimientos' && (
        <div className="space-y-4">
          {/* Search and Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0f172a] border border-slate-800 p-3 rounded-2xl">
            {/* Search query */}
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

            {/* Type filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="All">Todos los Tipos</option>
              <option value="Ingreso">Solo Ingresos (+)</option>
              <option value="Gasto">Solo Gastos (-)</option>
            </select>

            {/* Category filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none max-w-[160px]"
            >
              <option value="All">Todas las Categorías</option>
              {normalizedCategories.map(c => (
                <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
              ))}
            </select>

            {/* Wallet filter */}
            <select
              value={filterWallet}
              onChange={(e) => setFilterWallet(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none max-w-[160px]"
            >
              <option value="All">Todas las Cuentas</option>
              {wallets.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          {/* Transactions Table */}
          <div className="rounded-2xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider">
              <span>Historial de Movimientos ({filteredList.length})</span>
              {selectedMonth !== 'All' && (
                <span className="text-[10px] text-cyan-400 font-mono">
                  Mes: {selectedMonth}
                </span>
              )}
            </div>

            {filteredList.length === 0 ? (
              <div className="text-center py-12 px-4 text-slate-500 text-xs">
                <Tag className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                No se encontraron transacciones registradas para este filtro o período.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/60 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Fecha</th>
                      <th className="p-3">Concepto & Categoría</th>
                      <th className="p-3">Cuenta / Wallet</th>
                      <th className="p-3 text-right">Monto</th>
                      <th className="p-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredList.map(tx => {
                      const isInc = tx.tipo === 'Ingreso';
                      const matchingCat = normalizedCategories.find(c => c.name?.toLowerCase() === tx.categoria?.toLowerCase());
                      const catIcon = matchingCat?.icon || (isInc ? '📈' : '📉');

                      return (
                        <tr key={tx.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-3 font-mono text-slate-400 whitespace-nowrap text-[11px]">
                            {tx.date}
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{tx.concepto}</span>
                              {tx.isRecurring && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                  <Repeat className="w-2.5 h-2.5" /> Recurrente
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <span>{catIcon}</span>
                              <span>{tx.categoria}</span>
                            </div>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span className="text-cyan-400 font-medium">{tx.walletNombre || 'Cuenta'}</span>
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <div
                              className={`font-black font-mono text-sm ${
                                isInc ? 'text-emerald-400' : 'text-rose-400'
                              } ${isPrivacyMode ? 'privacy-blur' : ''}`}
                            >
                              {isInc ? '+' : '-'} {formatMoney(tx.montoDOP)}
                            </div>
                            {tx.moneda && tx.moneda !== 'DOP' && tx.montoOriginal && (
                              <div className="text-[10px] text-slate-500 font-mono">
                                {tx.moneda} ${tx.montoOriginal.toFixed(2)}
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                if (window.confirm(`¿Seguro que deseas eliminar "${tx.concepto}"?`)) {
                                  deleteTransaction(tx.id);
                                }
                              }}
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
      )}

      {/* Modal: Crear Nueva Categoría */}
      {showNewCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-400" /> Crear Nueva Categoría
              </h3>
              <button
                onClick={() => setShowNewCategoryModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Nombre de la Categoría <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Ej: Gimnasio, Mascotas, Educación..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Icono / Emoji
                  </label>
                  <input
                    type="text"
                    value={newCatIcon}
                    onChange={(e) => setNewCatIcon(e.target.value)}
                    placeholder="🏷️"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-center focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Tipo
                  </label>
                  <select
                    value={newCatType}
                    onChange={(e) => setNewCatType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="gasto">Gasto (-)</option>
                    <option value="ingreso">Ingreso (+)</option>
                  </select>
                </div>
              </div>

              {newCatType === 'gasto' && (
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Presupuesto Mensual Sugerido (RD$ - Opcional)
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={newCatBudget}
                    onChange={(e) => setNewCatBudget(e.target.value)}
                    placeholder="Ej: 5000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCategoryModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Guardar Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ajustar Presupuesto de Categoría */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" /> Presupuesto Mensual
              </h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="text-xs text-slate-300 font-bold mb-1 flex items-center gap-2">
                <span className="text-lg">{editingCategory.icon}</span>
                <span>{editingCategory.name}</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Asigna el límite máximo mensual recomendado para esta categoría.
              </p>

              <form onSubmit={handleSaveCategoryBudget} className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Límite Mensual en RD$
                  </label>
                  <input
                    type="number"
                    step="100"
                    min="0"
                    required
                    value={budgetEditAmount}
                    onChange={(e) => setBudgetEditAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                  >
                    Actualizar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
