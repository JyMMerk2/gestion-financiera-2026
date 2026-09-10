import React, { useState } from 'react';
import {
  Baby,
  Building,
  Car,
  CheckCircle2,
  Plus,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export const EspecialesView: React.FC = () => {
  const { formatMoney, isPrivacyMode } = useFinancial();
  const [activeTab, setActiveTab] = useState<'bebe' | 'obra' | 'auto'>('bebe');

  // Plan Bebé items
  const [bebeItems, setBebeItems] = useState([
    { id: '1', name: 'Habitación & Cuna / Moisés', costDOP: 25000, purchased: true },
    { id: '2', name: 'Cobertura de Parto y Clínica (Deducible)', costDOP: 45000, purchased: true },
    { id: '3', name: 'Coche / Asiento Car Seat', costDOP: 18500, purchased: false },
    { id: '4', name: 'Ropa recién nacido y pañales lote inicial', costDOP: 12000, purchased: true },
    { id: '5', name: 'Vacunas y pediatría primeros 6 meses', costDOP: 20000, purchased: false },
  ]);

  // Obra / Proyecto items
  const [obraItems, setObraItems] = useState([
    { id: 'o1', name: 'Deslinde y Título Solar Gurabo', costDOP: 40000, completed: true },
    { id: 'o2', name: 'Plano Arquitectónico y Permisos', costDOP: 65000, completed: true },
    { id: 'o3', name: 'Muro perimetral y verja frontal', costDOP: 120000, completed: false },
    { id: 'o4', name: 'Acometida eléctrica y cisterna 3,000 gls', costDOP: 85000, completed: false },
  ]);

  // Vehículo items
  const [autoItems, setAutoItems] = useState([
    { id: 'a1', name: 'Cambio de Aceite Sintético y Filtro', costDOP: 4200, done: true, nextDue: 'Oct 2026' },
    { id: 'a2', name: 'Renovación Seguro Full / Marbete', costDOP: 18500, done: false, nextDue: 'Dic 2026' },
    { id: 'a3', name: 'Alineación, balanceo y rotación de gomas', costDOP: 2500, done: true, nextDue: 'Ene 2027' },
  ]);

  const toggleBebeItem = (id: string) => {
    setBebeItems(prev => prev.map(i => i.id === id ? { ...i, purchased: !i.purchased } : i));
  };

  const toggleObraItem = (id: string) => {
    setObraItems(prev => prev.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
  };

  const toggleAutoItem = (id: string) => {
    setAutoItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  };

  // Calculations
  const bebeTotal = bebeItems.reduce((acc, i) => acc + i.costDOP, 0);
  const bebeSpent = bebeItems.filter(i => i.purchased).reduce((acc, i) => acc + i.costDOP, 0);

  const obraTotal = obraItems.reduce((acc, i) => acc + i.costDOP, 0);
  const obraSpent = obraItems.filter(i => i.completed).reduce((acc, i) => acc + i.costDOP, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">
          Módulos Especiales de Proyecto Familiar
        </h2>
        <p className="text-xs text-slate-400">
          Presupuesto dedicado para Plan Bebé, Obras de Construcción y Mantenimiento Vehicular
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-[#0f172a] p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('bebe')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'bebe' ? 'bg-pink-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Baby className="w-4 h-4" />
          <span>Plan Bebé</span>
        </button>

        <button
          onClick={() => setActiveTab('obra')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'obra' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Obra / Solar Gurabo</span>
        </button>

        <button
          onClick={() => setActiveTab('auto')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'auto' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Vehículo Familiar</span>
        </button>
      </div>

      {/* Tab 1: Plan Bebé */}
      {activeTab === 'bebe' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-pink-950/40 border border-pink-500/30 p-5 shadow-xl flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Presupuesto Ejecutado Plan Bebé</div>
              <div className={`text-2xl font-black text-pink-400 font-mono mt-0.5 ${isPrivacyMode ? 'privacy-blur' : ''}`}>
                {formatMoney(bebeSpent)} <span className="text-xs text-slate-400 font-normal">/ {formatMoney(bebeTotal)}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Baby className="w-6 h-6" />
            </div>
          </div>

          <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-4 space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Lista de Compras y Preparativos de Llegada
            </div>
            {bebeItems.map(item => (
              <div
                key={item.id}
                onClick={() => toggleBebeItem(item.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  item.purchased
                    ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                    : 'bg-slate-900 border-pink-500/30 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      item.purchased ? 'bg-pink-500 border-pink-400 text-slate-950' : 'border-slate-700'
                    }`}
                  >
                    {item.purchased && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-xs font-bold ${item.purchased ? 'line-through' : ''}`}>
                    {item.name}
                  </span>
                </div>
                <span className={`font-mono text-xs font-bold ${item.purchased ? 'text-slate-500' : 'text-pink-400'}`}>
                  {formatMoney(item.costDOP)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Obra Construcción */}
      {activeTab === 'obra' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 p-5 shadow-xl flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Inversión en Obra Solar Gurabo</div>
              <div className={`text-2xl font-black text-amber-400 font-mono mt-0.5 ${isPrivacyMode ? 'privacy-blur' : ''}`}>
                {formatMoney(obraSpent)} <span className="text-xs text-slate-400 font-normal">/ {formatMoney(obraTotal)}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Building className="w-6 h-6" />
            </div>
          </div>

          <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-4 space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Hitos y Etapas del Proyecto
            </div>
            {obraItems.map(item => (
              <div
                key={item.id}
                onClick={() => toggleObraItem(item.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  item.completed
                    ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                    : 'bg-slate-900 border-amber-500/30 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      item.completed ? 'bg-amber-500 border-amber-400 text-slate-950' : 'border-slate-700'
                    }`}
                  >
                    {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-xs font-bold ${item.completed ? 'line-through' : ''}`}>
                    {item.name}
                  </span>
                </div>
                <span className={`font-mono text-xs font-bold ${item.completed ? 'text-slate-500' : 'text-amber-400'}`}>
                  {formatMoney(item.costDOP)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Vehículo */}
      {activeTab === 'auto' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-4 space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Bitácora de Mantenimientos y Seguros
            </div>
            {autoItems.map(item => (
              <div
                key={item.id}
                onClick={() => toggleAutoItem(item.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  item.done
                    ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                    : 'bg-slate-900 border-cyan-500/30 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      item.done ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700'
                    }`}
                  >
                    {item.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className={`text-xs font-bold ${item.done ? 'line-through' : ''}`}>
                      {item.name}
                    </span>
                    <div className="text-[10px] text-slate-400">Próximo vencimiento: {item.nextDue}</div>
                  </div>
                </div>
                <span className={`font-mono text-xs font-bold ${item.done ? 'text-slate-500' : 'text-cyan-400'}`}>
                  {formatMoney(item.costDOP)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
