import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Download,
  ArrowRightLeft,
  TrendingUp,
  Wallet as WalletIcon,
  ShieldCheck,
  PiggyBank,
  Receipt,
  Gem,
  Plus
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { CoopShare } from '../types';

interface DashboardViewProps {
  onOpenTransfer: (walletId?: string) => void;
  onOpenCoopModal: (coop: CoopShare) => void;
  onOpenExport: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenTransfer,
  onOpenCoopModal,
  onOpenExport,
  onNavigateToTab,
}) => {
  const {
    user,
    selectedPeriod,
    changePeriodDelta,
    isPrivacyMode,
    togglePrivacyMode,
    transactions,
    wallets,
    coopShares,
    loans,
    assets,
    savingsFunds,
    formatMoney,
  } = useFinancial();

  // Period formatted name (e.g. "Ago 2026")
  const [yearStr, monthStr] = selectedPeriod.split('-');
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const monthIdx = parseInt(monthStr, 10) - 1;
  const periodLabel = `${monthNames[monthIdx] || ''} ${yearStr}`;

  // Filter transactions for selected period
  const periodTxs = transactions.filter(t => t.date.startsWith(selectedPeriod));

  // Compute income & expense for current period
  const totalIncome = periodTxs
    .filter(t => t.tipo === 'Ingreso')
    .reduce((acc, t) => acc + t.montoDOP, 0);

  const totalExpense = periodTxs
    .filter(t => t.tipo === 'Gasto')
    .reduce((acc, t) => acc + t.montoDOP, 0);

  const netSavings = totalIncome - totalExpense;

  // Liquid wallet sum
  const liquidWalletsTotal = wallets.reduce((acc, w) => acc + w.balanceDOP, 0);

  // Coop Shares sum
  const totalCoopShares = coopShares.reduce((acc, cp) => acc + cp.montoDOP, 0);

  // Tangible assets sum
  const totalTangibleAssets = assets.reduce((acc, a) => acc + a.valorEstimadoDOP, 0);

  // Outstanding debts sum
  const totalOutstandingDebts = loans.reduce((acc, l) => acc + l.saldoPendienteDOP, 0);

  // Total savings allocated in funds
  const totalSavingsAllocated = savingsFunds.reduce((acc, f) => acc + f.currentAmountDOP, 0);

  // Net Worth (Total Assets - Total Liabilities)
  const totalAssets = liquidWalletsTotal + totalCoopShares + totalTangibleAssets;
  const netWorth = totalAssets - totalOutstandingDebts;

  // Free cash available (Liquid wallets minus reserved funds)
  const realAvailable = Math.max(0, liquidWalletsTotal - totalSavingsAllocated);

  // Build 12-month data for savings habits bar chart
  const currentYear = parseInt(yearStr, 10);
  const currentMonthNum = parseInt(monthStr, 10);
  const months12Array = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(currentYear, currentMonthNum - 1 - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const key = `${y}-${m}`;
    const txsInMonth = transactions.filter(t => t.date.startsWith(key));
    const inc = txsInMonth.filter(t => t.tipo === 'Ingreso').reduce((acc, t) => acc + t.montoDOP, 0);
    const exp = txsInMonth.filter(t => t.tipo === 'Gasto').reduce((acc, t) => acc + t.montoDOP, 0);
    const sav = inc - exp;

    months12Array.push({
      key,
      label: monthNames[d.getMonth()],
      savings: sav,
      isCurrent: i === 0,
    });
  }

  return (
    <div className="space-y-5">
      {/* Top Welcome & Period Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-1">
        {/* Left: Privacy Eye & User Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePrivacyMode}
            title={isPrivacyMode ? 'Mostrar montos' : 'Ocultar montos'}
            className="w-10 h-10 rounded-full border border-slate-800 bg-[#0f172a] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
          >
            {isPrivacyMode ? <EyeOff className="w-5 h-5 text-amber-400" /> : <Eye className="w-5 h-5 text-cyan-400" />}
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Hola, <span className="uppercase text-cyan-400">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Resumen financiero consolidado</p>
          </div>
        </div>

        {/* Right: Period selector & Export Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-[#0f172a] border border-slate-800 rounded-full px-3 py-1.5 shadow-sm">
            <button
              onClick={() => changePeriodDelta(-1)}
              title="Mes anterior"
              className="p-1 hover:text-cyan-400 text-slate-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-xs text-white min-w-[75px] text-center tracking-wide">
              {periodLabel}
            </span>
            <button
              onClick={() => changePeriodDelta(1)}
              title="Mes siguiente"
              className="p-1 hover:text-cyan-400 text-slate-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0f172a] border border-slate-800 text-xs font-bold text-slate-200 hover:text-cyan-300 hover:border-cyan-500/40 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column KPI Summary Container (Exact layout from user code) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl bg-[#0f172a] border border-slate-800 p-4 sm:p-5 shadow-xl">
        <div className="sm:border-r border-slate-800/80 sm:pr-4">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-emerald-400">📈</span> INGRESOS TOTALES
          </div>
          <div
            className={`text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1 ${
              isPrivacyMode ? 'privacy-blur' : ''
            }`}
          >
            {formatMoney(totalIncome)}
          </div>
        </div>

        <div className="sm:border-r border-slate-800/80 sm:pr-4 sm:pl-2">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-rose-400">📉</span> GASTOS TOTALES
          </div>
          <div
            className={`text-xl sm:text-2xl font-black text-rose-400 font-mono mt-1 ${
              isPrivacyMode ? 'privacy-blur' : ''
            }`}
          >
            {formatMoney(totalExpense)}
          </div>
        </div>

        <div className="sm:pl-2">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-cyan-400">🪙</span> AHORRO NETO DEL MES
          </div>
          <div
            className={`text-xl sm:text-2xl font-black font-mono mt-1 ${
              netSavings >= 0 ? 'text-cyan-400' : 'text-rose-400'
            } ${isPrivacyMode ? 'privacy-blur' : ''}`}
          >
            {formatMoney(netSavings)}
          </div>
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          onClick={() => onNavigateToTab('prestamos')}
          className="rounded-xl bg-[#0f172a] border border-slate-800/90 p-3.5 cursor-pointer hover:border-amber-500/40 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-500" />
          <div className="text-[10px] uppercase font-bold text-slate-400">Deudas Pendientes</div>
          <div
            className={`text-base sm:text-lg font-black text-amber-400 font-mono mt-1 ${
              isPrivacyMode ? 'privacy-blur' : ''
            }`}
          >
            {formatMoney(totalOutstandingDebts)}
          </div>
        </div>

        <div
          onClick={() => onNavigateToTab('patrimonio')}
          className="rounded-xl bg-[#0f172a] border border-slate-800/90 p-3.5 cursor-pointer hover:border-orange-500/40 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-orange-500" />
          <div className="text-[10px] uppercase font-bold text-slate-400">Acciones Coop</div>
          <div
            className={`text-base sm:text-lg font-black text-orange-400 font-mono mt-1 ${
              isPrivacyMode ? 'privacy-blur' : ''
            }`}
          >
            {formatMoney(totalCoopShares)}
          </div>
        </div>

        <div
          onClick={() => onNavigateToTab('patrimonio')}
          className="rounded-xl bg-[#0f172a] border border-slate-800/90 p-3.5 cursor-pointer hover:border-purple-500/40 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-purple-500" />
          <div className="text-[10px] uppercase font-bold text-slate-400">Patrimonio Neto</div>
          <div
            className={`text-base sm:text-lg font-black text-purple-400 font-mono mt-1 ${
              isPrivacyMode ? 'privacy-blur' : ''
            }`}
          >
            {formatMoney(netWorth)}
          </div>
        </div>

        <div
          onClick={() => onNavigateToTab('wallets')}
          className="rounded-xl bg-[#0f172a] border border-slate-800/90 p-3.5 cursor-pointer hover:border-cyan-500/40 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-cyan-400" />
          <div className="text-[10px] uppercase font-bold text-slate-400">Disponible Real</div>
          <div
            className={`text-base sm:text-lg font-black text-cyan-300 font-mono mt-1 ${
              isPrivacyMode ? 'privacy-blur' : ''
            }`}
          >
            {formatMoney(realAvailable)}
          </div>
        </div>
      </div>

      {/* 12-Month Savings Habits Chart Panel */}
      <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            Ahorro Mensual — Últimos 12 Meses
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Ahorro (+)
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Déficit (-)
            </span>
          </div>
        </div>

        {/* Dynamic SVG / Tailwind Bar Chart */}
        <div className="w-full min-h-[140px] flex items-end justify-between gap-1.5 sm:gap-2 pt-6 pb-2 border-b border-slate-800">
          {months12Array.map(m => {
            const isDeficit = m.savings < 0;
            const heightPx = Math.min(Math.max(Math.abs(m.savings) / 400, 12), 110);
            return (
              <div key={m.key} className="flex-1 flex flex-col items-center group relative">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-8 bg-slate-950 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-slate-800 transition-opacity whitespace-nowrap z-10">
                  {formatMoney(m.savings)}
                </div>
                <div
                  style={{ height: `${heightPx}px` }}
                  className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                    isDeficit
                      ? 'bg-rose-500 hover:bg-rose-400'
                      : 'bg-emerald-500 hover:bg-emerald-400'
                  } ${m.isCurrent ? 'ring-2 ring-cyan-400 shadow-md shadow-cyan-500/20' : 'opacity-80'}`}
                />
                <span
                  className={`text-[9px] font-bold mt-2 truncate ${
                    m.isCurrent ? 'text-cyan-400 font-black' : 'text-slate-500'
                  }`}
                >
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Balance por Wallets / Cuentas Bancarias */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <WalletIcon className="w-3.5 h-3.5 text-cyan-400" /> Balance por Wallets (Clic para Transferir)
          </div>
          <button
            onClick={() => onOpenTransfer()}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
          >
            <ArrowRightLeft className="w-3 h-3" /> Nueva Transferencia
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {wallets.map(wallet => (
            <div
              key={wallet.id}
              onClick={() => onOpenTransfer(wallet.id)}
              className="p-3 rounded-xl bg-[#0f172a] border border-slate-800/90 hover:border-cyan-500/50 cursor-pointer transition-all hover:scale-[1.01] relative group overflow-hidden shadow-sm"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500/80 group-hover:bg-cyan-400 transition-colors" />
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-bold text-white truncate">{wallet.name}</span>
                <span className="text-base">{wallet.icon}</span>
              </div>
              <div
                className={`text-sm sm:text-base font-extrabold text-white font-mono ${
                  isPrivacyMode ? 'privacy-blur' : ''
                }`}
              >
                {formatMoney(wallet.balanceDOP)}
              </div>
              {wallet.currency !== 'DOP' && wallet.balanceOriginal !== undefined && (
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                  ({wallet.currency} ${wallet.balanceOriginal.toFixed(2)})
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Acciones e Inversiones en Cooperativas */}
      <div className="space-y-2.5">
        <div className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-orange-400" /> Acciones en Cooperativas (Clic para Actualizar)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {coopShares.map(coop => (
            <div
              key={coop.id}
              onClick={() => onOpenCoopModal(coop)}
              className="p-3.5 rounded-xl bg-[#0f172a] border border-slate-800 hover:border-orange-500/50 cursor-pointer transition-all hover:scale-[1.01] relative overflow-hidden shadow-sm"
            >
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-orange-500" />
              <div className="text-xs font-bold text-slate-300 truncate">{coop.coopName}</div>
              <div
                className={`text-base font-black text-orange-400 font-mono mt-1 ${
                  isPrivacyMode ? 'privacy-blur' : ''
                }`}
              >
                {formatMoney(coop.montoDOP)}
              </div>
              {coop.dividendYield && (
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                  Rendimiento estimado: <span className="text-emerald-400 font-bold">+{coop.dividendYield}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subdivisions of Savings Funds */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <PiggyBank className="w-3.5 h-3.5 text-purple-400" /> Subdivisions de Ahorros y Fondos
          </div>
          <button
            onClick={() => onNavigateToTab('ahorros')}
            className="text-[11px] text-purple-400 hover:text-purple-300 font-bold"
          >
            Ver Todas las Metas →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {savingsFunds.map(fund => {
            const progressPct = Math.min(Math.round((fund.currentAmountDOP / fund.targetAmountDOP) * 100), 100);
            return (
              <div
                key={fund.id}
                onClick={() => onNavigateToTab('ahorros')}
                className="p-3 rounded-xl bg-[#0f172a] border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all hover:scale-[1.01] relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-purple-500" />
                <div className="text-xs font-bold text-slate-300 truncate">{fund.name}</div>
                <div
                  className={`text-sm font-black text-purple-400 font-mono mt-1 ${
                    isPrivacyMode ? 'privacy-blur' : ''
                  }`}
                >
                  {formatMoney(fund.currentAmountDOP)}
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Monthly Transactions Feed */}
      <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            Últimas Transacciones de {periodLabel}
          </div>
          <button
            onClick={() => onNavigateToTab('presupuesto')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold"
          >
            Ver Historial Completo →
          </button>
        </div>

        {periodTxs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No hay movimientos registrados en {periodLabel}.
          </div>
        ) : (
          <div className="space-y-2">
            {periodTxs.slice(0, 5).map(tx => {
              const isIncome = tx.tipo === 'Ingreso';
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-900/70 border border-slate-800"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold text-white truncate">{tx.concepto}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span className="text-cyan-400 font-medium">{tx.walletNombre}</span>
                      <span>•</span>
                      <span>{tx.categoria}</span>
                    </div>
                  </div>

                  <div
                    className={`text-xs sm:text-sm font-black font-mono whitespace-nowrap ${
                      isIncome ? 'text-emerald-400' : 'text-rose-400'
                    } ${isPrivacyMode ? 'privacy-blur' : ''}`}
                  >
                    {isIncome ? '+' : '-'} {formatMoney(tx.montoDOP)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
