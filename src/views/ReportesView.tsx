import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  PieChart as PieIcon,
  TrendingUp,
  Percent,
  FileSpreadsheet,
  Printer
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

interface ReportesViewProps {
  onOpenExport: () => void;
}

export const ReportesView: React.FC<ReportesViewProps> = ({ onOpenExport }) => {
  const { transactions, formatMoney, isPrivacyMode } = useFinancial();
  const [reportPeriod, setReportPeriod] = useState(new Date().toISOString().substring(0, 7));

  // Transactions in period
  const periodTxs = transactions.filter(t => t.date.startsWith(reportPeriod));
  const incomeTxs = periodTxs.filter(t => t.tipo === 'Ingreso');
  const expenseTxs = periodTxs.filter(t => t.tipo === 'Gasto');

  const totalIncome = incomeTxs.reduce((acc, t) => acc + t.montoDOP, 0);
  const totalExpense = expenseTxs.reduce((acc, t) => acc + t.montoDOP, 0);
  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  // Breakdown by category
  const expenseByCategory: { [cat: string]: number } = {};
  expenseTxs.forEach(t => {
    expenseByCategory[t.categoria] = (expenseByCategory[t.categoria] || 0) + t.montoDOP;
  });

  const sortedCategories = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">
            Reportes y Analítica Financiera
          </h2>
          <p className="text-xs text-slate-400">
            Distribución de gastos por categoría, tasa de ahorro y exportación oficial
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="month"
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          />

          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase transition-all shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar PDF / Excel</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Ingresos Totales</div>
          <div className={`text-xl font-black text-emerald-400 font-mono mt-1 ${isPrivacyMode ? 'privacy-blur' : ''}`}>
            {formatMoney(totalIncome)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Gastos Totales</div>
          <div className={`text-xl font-black text-rose-400 font-mono mt-1 ${isPrivacyMode ? 'privacy-blur' : ''}`}>
            {formatMoney(totalExpense)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Ahorro Neto Generado</div>
          <div className={`text-xl font-black ${savings >= 0 ? 'text-cyan-400' : 'text-rose-400'} font-mono mt-1 ${isPrivacyMode ? 'privacy-blur' : ''}`}>
            {formatMoney(savings)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Tasa de Ahorro</div>
          <div className="text-xl font-black text-purple-400 font-mono mt-1">
            {savingsRate}%
          </div>
        </div>
      </div>

      {/* Expense by Category Bars */}
      <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>Distribución de Gastos por Categoría ({reportPeriod})</span>
        </div>

        {sortedCategories.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No hay gastos registrados en este periodo.
          </div>
        ) : (
          <div className="space-y-3">
            {sortedCategories.map(([cat, amount]) => {
              const pct = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{cat}</span>
                    <span className="font-mono text-slate-300">
                      <strong className={isPrivacyMode ? 'privacy-blur' : ''}>{formatMoney(amount)}</strong> ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
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
