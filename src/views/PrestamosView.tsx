import React, { useState } from 'react';
import {
  Receipt,
  AlertCircle,
  Calendar,
  CheckCircle2,
  DollarSign,
  Plus,
  ArrowDownLeft,
  Building2
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export const PrestamosView: React.FC = () => {
  const {
    loans,
    wallets,
    payLoanInstallment,
    formatMoney,
    isPrivacyMode
  } = useFinancial();

  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [sourceWalletId, setSourceWalletId] = useState(wallets[0]?.id || '');
  const [notes, setNotes] = useState('');

  const selectedLoan = loans.find(l => l.id === selectedLoanId);

  const handlePayInstallment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(paymentAmount);
    if (!selectedLoanId || isNaN(amount) || amount <= 0) return;

    payLoanInstallment(selectedLoanId, amount, sourceWalletId || undefined, notes.trim() || undefined);
    setPaymentAmount('');
    setSelectedLoanId(null);
    setNotes('');
  };

  const totalOutstanding = loans.reduce((acc, l) => acc + l.saldoPendienteDOP, 0);
  const totalMonthlyInstallments = loans.reduce((acc, l) => acc + l.cuotaMensualDOP, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">
            Gestión de Préstamos y Deudas
          </h2>
          <p className="text-xs text-slate-400">
            Control de pasivos, calendario de cuotas y abonos a capital
          </p>
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 p-5 shadow-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Deuda Total Pendiente (DOP)</div>
          <div
            className={`text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-1 ${
              isPrivacyMode ? 'privacy-blur' : ''
            }`}
          >
            {formatMoney(totalOutstanding)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Total préstamos activos: <strong className="text-white">{loans.length}</strong>
          </div>
        </div>

        <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-5 shadow-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Compromiso Mensual en Cuotas</div>
          <div
            className={`text-2xl sm:text-3xl font-black text-rose-400 font-mono mt-1 ${
              isPrivacyMode ? 'privacy-blur' : ''
            }`}
          >
            {formatMoney(totalMonthlyInstallments)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Suma de todas las cuotas fijas a pagar este mes
          </div>
        </div>
      </div>

      {/* Loans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loans.map(loan => {
          const paidPercentage = Math.round(((loan.montoOriginalDOP - loan.saldoPendienteDOP) / loan.montoOriginalDOP) * 100);

          return (
            <div
              key={loan.id}
              className="rounded-2xl bg-[#0f172a] border border-slate-800 p-5 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{loan.nombre}</div>
                      <div className="text-[10px] text-slate-400">{loan.acreedor}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    {loan.tasaInteresAnual}% Anual
                  </span>
                </div>

                <div className="space-y-2 my-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Saldo Pendiente</span>
                    <span
                      className={`text-lg font-black text-amber-400 font-mono ${
                        isPrivacyMode ? 'privacy-blur' : ''
                      }`}
                    >
                      {formatMoney(loan.saldoPendienteDOP)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Monto Original:</span>
                    <span className="font-mono text-slate-200">{formatMoney(loan.montoOriginalDOP)}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Cuota Mensual:</span>
                    <span className="font-mono text-rose-400 font-bold">{formatMoney(loan.cuotaMensualDOP)}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Día de Pago:</span>
                    <span className="font-bold text-slate-200">Día {loan.diaPagoMes} de cada mes</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 rounded-full h-2 my-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${paidPercentage}%` }}
                  />
                </div>
                <div className="text-[10px] text-right text-slate-500 font-mono">
                  {paidPercentage}% de capital amortizado
                </div>
              </div>

              {/* Pay installment action */}
              <div className="border-t border-slate-800/80 pt-3 mt-4">
                <button
                  onClick={() => {
                    setSelectedLoanId(loan.id);
                    setPaymentAmount(String(loan.cuotaMensualDOP));
                  }}
                  className="w-full py-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>Pagar Cuota / Abono</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pay Loan Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#0f172a] border border-slate-800 p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
              Pagar Préstamo: {selectedLoan.nombre}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Se registrará un gasto en tu presupuesto y se reducirá el saldo de la deuda.
            </p>

            <form onSubmit={handlePayInstallment} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Cuenta de Débito
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
                  Monto a Pagar (RD$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Notas / Comprobante
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Cuota 14/36, Ref #98124"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLoanId(null)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold uppercase tracking-wider"
                >
                  Registrar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
