import React, { useState } from 'react';
import {
  Gem,
  Plus,
  Building,
  TrendingUp,
  CreditCard,
  Receipt,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export const PatrimonioView: React.FC = () => {
  const {
    wallets,
    coopShares,
    assets,
    loans,
    addAsset,
    deleteAsset,
    formatMoney,
    isPrivacyMode
  } = useFinancial();

  const [showAddAsset, setShowAddAsset] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('Inmueble');
  const [assetValue, setAssetValue] = useState('');
  const [assetNotes, setAssetNotes] = useState('');

  // Calculations
  const totalLiquid = wallets.reduce((acc, w) => acc + w.balanceDOP, 0);
  const totalCoop = coopShares.reduce((acc, c) => acc + c.montoDOP, 0);
  const totalTangibles = assets.reduce((acc, a) => acc + a.valorEstimadoDOP, 0);
  const totalAssets = totalLiquid + totalCoop + totalTangibles;

  const totalLiabilities = loans.reduce((acc, l) => acc + l.saldoPendienteDOP, 0);
  const netWorth = totalAssets - totalLiabilities;

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(assetValue);
    if (!assetName.trim() || isNaN(val) || val <= 0) return;

    addAsset({
      nombre: assetName.trim(),
      tipo: assetType,
      valorEstimadoDOP: val,
      notas: assetNotes.trim() || undefined,
    });

    setAssetName('');
    setAssetValue('');
    setAssetNotes('');
    setShowAddAsset(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">
            Patrimonio Neto Familiar
          </h2>
          <p className="text-xs text-slate-400">
            Balance general de activos, inversiones cooperativas y pasivos
          </p>
        </div>

        <button
          onClick={() => setShowAddAsset(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold uppercase transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Activo Fijo</span>
        </button>
      </div>

      {/* Main Net Worth Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 border border-purple-500/30 p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold text-slate-400">Patrimonio Neto Total Consolidado</div>
          <div
            className={`text-3xl sm:text-4xl font-black text-purple-400 font-mono mt-1 ${
              isPrivacyMode ? 'privacy-blur' : ''
            }`}
          >
            {formatMoney(netWorth)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Activos Totales ({formatMoney(totalAssets)}) menos Pasivos Totales ({formatMoney(totalLiabilities)})
          </p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-inner">
          <Gem className="w-8 h-8" />
        </div>
      </div>

      {/* Assets vs Liabilities Breakdown Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activos */}
        <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Activos Totales</span>
            </div>
            <span className={`text-base font-black text-emerald-400 font-mono ${isPrivacyMode ? 'privacy-blur' : ''}`}>
              {formatMoney(totalAssets)}
            </span>
          </div>

          {/* Liquid Wallets */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" /> Cuentas Líquidas ({wallets.length})
              </span>
              <span className={`font-mono text-slate-200 font-bold ${isPrivacyMode ? 'privacy-blur' : ''}`}>
                {formatMoney(totalLiquid)}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Suma disponible en bancos y billeteras de efectivo</p>
          </div>

          {/* Acciones Coop */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-amber-400" /> Acciones Cooperativas ({coopShares.length})
              </span>
              <span className={`font-mono text-slate-200 font-bold ${isPrivacyMode ? 'privacy-blur' : ''}`}>
                {formatMoney(totalCoop)}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Coop La Altagracia, Coop Mamoncito, CoopSanJosé</p>
          </div>

          {/* Tangible Assets */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Bienes Raíces y Activos Fijos ({assets.length})
            </div>
            {assets.map(asset => (
              <div
                key={asset.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white">{asset.nombre}</div>
                  <div className="text-[10px] text-slate-400">{asset.tipo} {asset.notas && `• ${asset.notas}`}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-xs font-bold text-white ${isPrivacyMode ? 'privacy-blur' : ''}`}>
                    {formatMoney(asset.valorEstimadoDOP)}
                  </span>
                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pasivos */}
        <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Receipt className="w-4 h-4 text-rose-400" />
              <span>Pasivos Totales</span>
            </div>
            <span className={`text-base font-black text-rose-400 font-mono ${isPrivacyMode ? 'privacy-blur' : ''}`}>
              {formatMoney(totalLiabilities)}
            </span>
          </div>

          <div className="space-y-2">
            {loans.map(loan => (
              <div
                key={loan.id}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{loan.nombre}</div>
                  <div className="text-[10px] text-slate-400">{loan.acreedor} • Cuota: {formatMoney(loan.cuotaMensualDOP)}/mes</div>
                </div>
                <span className={`font-mono text-xs font-bold text-rose-400 ${isPrivacyMode ? 'privacy-blur' : ''}`}>
                  {formatMoney(loan.saldoPendienteDOP)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Asset Modal */}
      {showAddAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#0f172a] border border-slate-800 p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
              Registrar Activo Fijo
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Agrega inmuebles, solares, vehículos o joyas a tu patrimonio.
            </p>

            <form onSubmit={handleAddAsset} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Nombre del Activo
                </label>
                <input
                  type="text"
                  required
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="Ej: Solar en Gurabo, Vehículo Toyota..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Tipo
                </label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Inmueble">Inmueble / Solar / Terreno</option>
                  <option value="Vehículo">Vehículo / Motor</option>
                  <option value="Joyas / Oro">Joyas / Oro / Coleccionables</option>
                  <option value="Equipo / Negocio">Equipo / Negocio</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Valor Estimado de Mercado (RD$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={assetValue}
                  onChange={(e) => setAssetValue(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Notas
                </label>
                <input
                  type="text"
                  value={assetNotes}
                  onChange={(e) => setAssetNotes(e.target.value)}
                  placeholder="Opcional: Título deslindado, tasación..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAsset(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-bold uppercase tracking-wider"
                >
                  Guardar Activo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
