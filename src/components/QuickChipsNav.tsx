import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Receipt,
  Gem,
  BarChart3,
  Layers,
  Settings
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'presupuesto'
  | 'wallets'
  | 'ahorros'
  | 'prestamos'
  | 'patrimonio'
  | 'reportes'
  | 'especiales'
  | 'ajustes';

interface QuickChipsNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
}

export const QuickChipsNav: React.FC<QuickChipsNavProps> = ({ activeTab, onChangeTab }) => {
  const chips: { id: ActiveTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'presupuesto', label: 'Presupuesto', icon: TrendingUp },
    { id: 'wallets', label: 'Wallets', icon: CreditCard },
    { id: 'ahorros', label: 'Ahorros & Metas', icon: PiggyBank },
    { id: 'prestamos', label: 'Préstamos', icon: Receipt },
    { id: 'patrimonio', label: 'Patrimonio', icon: Gem },
    { id: 'reportes', label: 'Reportes & Gráficas', icon: BarChart3 },
    { id: 'especiales', label: 'Bebé & Proyectos', icon: Layers },
    { id: 'ajustes', label: 'Ajustes', icon: Settings },
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 mb-4">
      <div className="flex items-center gap-2 min-w-max px-1">
        {chips.map(chip => {
          const Icon = chip.icon;
          const isActive = activeTab === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => onChangeTab(chip.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 scale-[1.02]'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
