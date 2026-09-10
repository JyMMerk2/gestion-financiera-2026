import React, { useState } from 'react';
import { X, FileSpreadsheet, Printer, Download, Calendar, Check, FileText } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { transactions, wallets, loans, savingsFunds, family, formatMoney, selectedPeriod } = useFinancial();
  const [startMonth, setStartMonth] = useState(selectedPeriod);
  const [endMonth, setEndMonth] = useState(selectedPeriod);
  const [exported, setExported] = useState(false);

  if (!isOpen) return null;

  // Filter transactions by selected range
  const filteredTxs = transactions.filter(t => {
    const m = t.date.substring(0, 7);
    return m >= startMonth && m <= endMonth;
  });

  const handleExportExcel = () => {
    // Generate CSV formatted for Microsoft Excel with UTF-8 BOM
    const headers = ['ID', 'Fecha', 'Tipo', 'Categoría', 'Concepto', 'Moneda Orig', 'Tasa Cambio', 'Monto DOP (RD$)', 'Wallet', 'Registrado Por'];
    const rows = filteredTxs.map(t => [
      t.id,
      t.date,
      t.tipo,
      `"${t.categoria.replace(/"/g, '""')}"`,
      `"${t.concepto.replace(/"/g, '""')}"`,
      t.moneda,
      t.tasaCambio,
      t.montoDOP.toFixed(2),
      `"${t.walletNombre.replace(/"/g, '""')}"`,
      `"${(t.createdByUserName || 'Usuario').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Estado_Financiero_${family.name.replace(/\s+/g, '_')}_${startMonth}_a_${endMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-[#0f172a] border border-slate-800 p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Exportar Reportes Financieros
              </h3>
              <p className="text-xs text-slate-400">Descarga estados de cuenta en PDF o Excel (CSV)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date Filter Range */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 mb-5 space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Seleccionar Periodo a Exportar
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Mes Inicio</label>
              <input
                type="month"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Mes Fin</label>
              <input
                type="month"
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <div className="text-[11px] text-cyan-400 font-medium">
            Registros encontrados para el rango: <strong>{filteredTxs.length} transacciones</strong>
          </div>
        </div>

        {/* Export Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleExportExcel}
            className="p-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-emerald-500/30 hover:border-emerald-500 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-105 transition-transform">
              {exported ? <Check className="w-4 h-4" /> : <FileSpreadsheet className="w-4 h-4" />}
            </div>
            <div className="text-xs font-bold text-white uppercase">Descargar Excel (.CSV)</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Compatible con Microsoft Excel, Google Sheets y Numbers.</p>
          </button>

          <button
            onClick={handlePrintPDF}
            className="p-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-cyan-500/30 hover:border-cyan-500 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2 group-hover:scale-105 transition-transform">
              <Printer className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white uppercase">Generar PDF / Imprimir</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Formato oficial membretado listo para guardar como PDF.</p>
          </button>
        </div>
      </div>
    </div>
  );
};
