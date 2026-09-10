import React, { useState } from 'react';
import { FinancialProvider, useFinancial } from './context/FinancialContext';
import { TopBar } from './components/TopBar';
import { QuickChipsNav, ActiveTab } from './components/QuickChipsNav';
import { LoginScreen } from './components/LoginScreen';
import { FamilyManagementModal } from './components/FamilyManagementModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { SharedCalendarModal } from './components/SharedCalendarModal';
import { PerformanceSecurityModal } from './components/PerformanceSecurityModal';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal';
import { ExportModal } from './components/ExportModal';
import { InstallAppModal } from './components/InstallAppModal';
import { TransferModal } from './components/TransferModal';
import { CoopShareModal } from './components/CoopShareModal';
import { UserAuthModal } from './components/UserAuthModal';

import { DashboardView } from './views/DashboardView';
import { PresupuestoView } from './views/PresupuestoView';
import { WalletsView } from './views/WalletsView';
import { AhorrosMetasView } from './views/AhorrosMetasView';
import { PrestamosView } from './views/PrestamosView';
import { PatrimonioView } from './views/PatrimonioView';
import { ReportesView } from './views/ReportesView';
import { EspecialesView } from './views/EspecialesView';
import { ConfiguracionView } from './views/ConfiguracionView';
import { CoopShare } from './types';

const MainLayout: React.FC = () => {
  const { isBiometricLocked } = useFinancial();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Modal Visibility States
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showTestsModal, setShowTestsModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showUserAuthModal, setShowUserAuthModal] = useState(false);
  const [userAuthMode, setUserAuthMode] = useState<'register' | 'login' | 'recover' | 'join'>('register');
  const [transferDefaultWallet, setTransferDefaultWallet] = useState<string | undefined>(undefined);
  const [selectedCoopShare, setSelectedCoopShare] = useState<CoopShare | null>(null);

  const handleOpenTransfer = (walletId?: string) => {
    setTransferDefaultWallet(walletId);
    setShowTransferModal(true);
  };

  const handleOpenUserAuth = (mode: 'register' | 'login' | 'recover' | 'join' = 'register') => {
    setUserAuthMode(mode);
    setShowUserAuthModal(true);
  };

  const handleOpenCoopModal = (coop: CoopShare) => {
    setSelectedCoopShare(coop);
  };

  if (isBiometricLocked) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Application Bar */}
      <TopBar
        onOpenFamily={() => setShowFamilyModal(true)}
        onOpenCalendar={() => setShowCalendarModal(true)}
        onOpenNotifications={() => setShowNotificationModal(true)}
        onOpenExport={() => setShowExportModal(true)}
        onOpenDocs={() => setShowDocsModal(true)}
        onOpenTests={() => setShowTestsModal(true)}
        onOpenInstall={() => setShowInstallModal(true)}
        onOpenHelp={() => setShowDocsModal(true)}
        onOpenUserAuth={handleOpenUserAuth}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4">
        {/* Navigation Quick Chips */}
        <QuickChipsNav activeTab={activeTab} onChangeTab={setActiveTab} />

        {/* Dynamic Tab Views */}
        <div className="animate-in fade-in duration-200">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenTransfer={handleOpenTransfer}
              onOpenCoopModal={handleOpenCoopModal}
              onOpenExport={() => setShowExportModal(true)}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'presupuesto' && <PresupuestoView />}

          {activeTab === 'wallets' && (
            <WalletsView onOpenTransfer={handleOpenTransfer} />
          )}

          {activeTab === 'ahorros' && <AhorrosMetasView />}

          {activeTab === 'prestamos' && <PrestamosView />}

          {activeTab === 'patrimonio' && <PatrimonioView />}

          {activeTab === 'reportes' && (
            <ReportesView onOpenExport={() => setShowExportModal(true)} />
          )}

          {activeTab === 'especiales' && <EspecialesView />}

          {activeTab === 'ajustes' && <ConfiguracionView />}
        </div>
      </main>

      {/* Modals & Dialogs */}
      <UserAuthModal
        isOpen={showUserAuthModal}
        onClose={() => setShowUserAuthModal(false)}
        initialMode={userAuthMode}
      />

      <FamilyManagementModal
        isOpen={showFamilyModal}
        onClose={() => setShowFamilyModal(false)}
      />

      <NotificationCenterModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />

      <SharedCalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
      />

      <PerformanceSecurityModal
        isOpen={showTestsModal}
        onClose={() => setShowTestsModal(false)}
      />

      <ArchitectureDocsModal
        isOpen={showDocsModal}
        onClose={() => setShowDocsModal(false)}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />

      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        defaultSourceWalletId={transferDefaultWallet}
      />

      <CoopShareModal
        isOpen={!!selectedCoopShare}
        onClose={() => setSelectedCoopShare(null)}
        selectedCoop={selectedCoopShare}
      />
    </div>
  );
};

export default function App() {
  return (
    <FinancialProvider>
      <MainLayout />
    </FinancialProvider>
  );
}
