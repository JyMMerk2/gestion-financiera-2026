import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  UserRole,
  FamilyGroup,
  Wallet,
  Category,
  Transaction,
  SavingsFund,
  SavingsMovement,
  Loan,
  CoopShare,
  AssetPatrimonial,
  CalendarEvent,
  FamilyNotification,
  ActivityLog,
  BabyItem,
  ConstructionItem,
  VehicleMaintenanceItem,
  ExchangeRates,
  OfflineAction,
  CurrencyCode
} from '../types';
import {
  INITIAL_USER,
  INITIAL_FAMILY,
  INITIAL_EXCHANGE_RATES,
  INITIAL_WALLETS,
  INITIAL_COOP_SHARES,
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_SAVINGS_FUNDS,
  INITIAL_SAVINGS_MOVEMENTS,
  INITIAL_LOANS,
  INITIAL_ASSETS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_BABY_ITEMS,
  INITIAL_CONSTRUCTION_ITEMS,
  INITIAL_VEHICLE_ITEMS,
  INITIAL_REGISTERED_USERS,
} from '../services/mockData';

interface FinancialContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  registeredUsers: UserProfile[];
  registerNewUser: (name: string, email: string, pin: string, role?: UserRole, inviteCode?: string) => { success: boolean; message: string; user?: UserProfile };
  loginUser: (emailOrName: string, pin: string) => { success: boolean; message: string };
  changePassword: (currentSecret: string, newSecret: string) => { success: boolean; message: string };
  resetUserDataToZero: () => void;
  switchActiveUser: (userId: string) => void;
  recoverUserAccount: (email: string) => { success: boolean; message: string; tempPin?: string };
  family: FamilyGroup;
  setFamily: React.Dispatch<React.SetStateAction<FamilyGroup>>;
  isBiometricLocked: boolean;
  setIsBiometricLocked: (locked: boolean) => void;
  unlockWithPinOrBiometric: (pin?: string) => boolean;
  lockApp: () => void;
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  selectedPeriod: string; // YYYY-MM
  setSelectedPeriod: (period: string) => void;
  changePeriodDelta: (deltaMonths: number) => void;
  exchangeRates: ExchangeRates;
  setExchangeRates: React.Dispatch<React.SetStateAction<ExchangeRates>>;
  updateExchangeRates: (rates: Partial<ExchangeRates>) => void;
  
  wallets: Wallet[];
  categories: Category[];
  transactions: Transaction[];
  savingsFunds: SavingsFund[];
  savingsMovements: SavingsMovement[];
  loans: Loan[];
  coopShares: CoopShare[];
  assets: AssetPatrimonial[];
  calendarEvents: CalendarEvent[];
  notifications: FamilyNotification[];
  activityLogs: ActivityLog[];
  babyItems: BabyItem[];
  constructionItems: ConstructionItem[];
  vehicleItems: VehicleMaintenanceItem[];
  
  isOnline: boolean;
  offlineQueue: OfflineAction[];
  syncOfflineQueue: () => void;
  
  // Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdByUserName' | 'createdById'>) => void;
  deleteTransaction: (id: string) => void;
  transferWalletFunds: (sourceWalletId: string, destWalletId: string, amountDOP: number, concept?: string) => void;
  depositToSavingsFund: (fundId: string, sourceWalletId: string, destWalletId: string, amount: number, currency: CurrencyCode, rate: number, concept: string) => void;
  depositToFund: (fundId: string, amount: number, sourceWalletId?: string) => void;
  addSavingsFund: (fund: Omit<SavingsFund, 'id' | 'currentAmountDOP'>) => void;
  addLoan: (loan: Omit<Loan, 'id' | 'pagadoAcumuladoDOP' | 'saldoPendienteDOP'>) => void;
  recordLoanPayment: (loanId: string, amountDOP: number, walletId: string, concept?: string) => void;
  payLoanInstallment: (loanId: string, amount: number, walletId?: string, notes?: string) => void;
  updateCoopShare: (coopId: string, amountDOP: number) => void;
  addAssetPatrimonial: (asset: Omit<AssetPatrimonial, 'id'>) => void;
  addAsset: (asset: Omit<AssetPatrimonial, 'id'>) => void;
  deleteAssetPatrimonial: (id: string) => void;
  deleteAsset: (id: string) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id' | 'completed'>) => void;
  toggleCalendarEventCompleted: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Special modules
  addBabyItem: (item: Omit<BabyItem, 'id'>) => void;
  toggleBabyItemStatus: (id: string) => void;
  addConstructionItem: (item: Omit<ConstructionItem, 'id'>) => void;
  addVehicleItem: (item: Omit<VehicleMaintenanceItem, 'id'>) => void;
  
  // Category management
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategoryBudget: (categoryId: string, newBudget: number) => void;
  
  // Family & Roles
  joinFamilyWithCode: (code: string, newFamilyName?: string) => boolean;
  generateNewInviteCode: () => string;
  updateMemberRole: (memberId: string, newRole: UserProfile['role']) => void;
  
  // Utilities
  formatMoney: (amount?: number | null, currency?: CurrencyCode) => string;
  resetAllData: () => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'finanzas_familiar_v2_data';

export const getCleanUserState = (userName: string = 'Usuario') => ({
  wallets: [
    {
      id: `w-cash-${Date.now()}`,
      name: 'Efectivo en Mano',
      currency: 'DOP' as const,
      balanceDOP: 0,
      balanceOriginal: 0,
      color: '#10b981',
      icon: '💵',
      isDefault: true,
    },
    {
      id: `w-bank-${Date.now()}`,
      name: 'Cuenta de Banco Principal',
      currency: 'DOP' as const,
      balanceDOP: 0,
      balanceOriginal: 0,
      color: '#06b6d4',
      icon: '🏦',
    },
    {
      id: `w-usd-${Date.now()}`,
      name: 'Cuenta de Ahorro USD',
      currency: 'USD' as const,
      balanceDOP: 0,
      balanceOriginal: 0,
      color: '#8b5cf6',
      icon: '🌎',
    },
  ],
  categories: INITIAL_CATEGORIES,
  transactions: [] as Transaction[],
  savingsFunds: [] as SavingsFund[],
  savingsMovements: [] as SavingsMovement[],
  loans: [] as Loan[],
  coopShares: [] as CoopShare[],
  assets: [] as AssetPatrimonial[],
  calendarEvents: [] as CalendarEvent[],
  babyItems: [] as BabyItem[],
  constructionItems: [] as ConstructionItem[],
  vehicleItems: [] as VehicleMaintenanceItem[],
  notifications: [
    {
      id: `notif-${Date.now()}`,
      title: '¡Bienvenido/a a Gestión Financiera!',
      message: `Hola ${userName}, tu cuenta ha comenzado limpia con todos los saldos en 0.00. Comienza agregando tus billeteras, ingresos o gastos.`,
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      read: false,
      type: 'info' as const,
    },
  ],
  activityLogs: [
    {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      userName,
      action: 'Creación de Cuenta',
      details: 'Nueva cuenta inicializada en 0.00 DOP sin datos previos.',
      section: 'Seguridad',
    },
  ],
});

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or defaults
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user`);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_registered_users`);
    return saved ? JSON.parse(saved) : INITIAL_REGISTERED_USERS;
  });

  // Pre-load user-specific bundle if active user is a new user (not usr-1)
  const initialUserData = (() => {
    try {
      const savedUserRaw = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user`);
      const initialUser: UserProfile = savedUserRaw ? JSON.parse(savedUserRaw) : INITIAL_USER;
      if (initialUser && initialUser.id && initialUser.id !== 'usr-1') {
        const rawBundle = localStorage.getItem(`${LOCAL_STORAGE_KEY}_userdata_${initialUser.id}`);
        if (rawBundle) {
          return JSON.parse(rawBundle);
        }
        return getCleanUserState(initialUser.name);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  })();

  const [family, setFamily] = useState<FamilyGroup>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_family`);
    return saved ? JSON.parse(saved) : INITIAL_FAMILY;
  });

  const [isBiometricLocked, setIsBiometricLocked] = useState<boolean>(true);
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2026-08');

  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(INITIAL_EXCHANGE_RATES);
  const [wallets, setWallets] = useState<Wallet[]>(() => {
    if (initialUserData?.wallets) return initialUserData.wallets;
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_wallets`);
    return saved ? JSON.parse(saved) : INITIAL_WALLETS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    if (initialUserData?.categories) return initialUserData.categories;
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_categories`);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (initialUserData?.transactions) return initialUserData.transactions;
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_transactions`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [savingsFunds, setSavingsFunds] = useState<SavingsFund[]>(() => {
    if (initialUserData?.savingsFunds) return initialUserData.savingsFunds;
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_funds`);
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_FUNDS;
  });

  const [savingsMovements, setSavingsMovements] = useState<SavingsMovement[]>(() => {
    if (initialUserData?.savingsMovements) return initialUserData.savingsMovements;
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_movements`);
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_MOVEMENTS;
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    if (initialUserData?.loans) return initialUserData.loans;
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_loans`);
    return saved ? JSON.parse(saved) : INITIAL_LOANS;
  });

  const [coopShares, setCoopShares] = useState<CoopShare[]>(() => {
    if (initialUserData?.coopShares) return initialUserData.coopShares;
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_coop`);
    return saved ? JSON.parse(saved) : INITIAL_COOP_SHARES;
  });

  const [assets, setAssets] = useState<AssetPatrimonial[]>(() => {
    if (initialUserData?.assets) return initialUserData.assets;
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_assets`);
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    if (initialUserData?.calendarEvents) return initialUserData.calendarEvents;
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_events`);
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
  });

  const [notifications, setNotifications] = useState<FamilyNotification[]>(() => {
    if (initialUserData?.notifications) return initialUserData.notifications;
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifs`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    if (initialUserData?.activityLogs) return initialUserData.activityLogs;
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_logs`);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [babyItems, setBabyItems] = useState<BabyItem[]>(() => {
    if (initialUserData?.babyItems) return initialUserData.babyItems;
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_baby`);
    return saved ? JSON.parse(saved) : INITIAL_BABY_ITEMS;
  });

  const [constructionItems, setConstructionItems] = useState<ConstructionItem[]>(() => {
    if (initialUserData?.constructionItems) return initialUserData.constructionItems;
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_construction`);
    return saved ? JSON.parse(saved) : INITIAL_CONSTRUCTION_ITEMS;
  });

  const [vehicleItems, setVehicleItems] = useState<VehicleMaintenanceItem[]>(() => {
    if (initialUserData?.vehicleItems) return initialUserData.vehicleItems;
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_vehicle`);
    return saved ? JSON.parse(saved) : INITIAL_VEHICLE_ITEMS;
  });

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<OfflineAction[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_offlineQueue`);
    return saved ? JSON.parse(saved) : [];
  });

  // Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineQueue]);

  // Persist core state
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(user));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_registered_users`, JSON.stringify(registeredUsers));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_family`, JSON.stringify(family));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_wallets`, JSON.stringify(wallets));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_categories`, JSON.stringify(categories));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_transactions`, JSON.stringify(transactions));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_funds`, JSON.stringify(savingsFunds));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_movements`, JSON.stringify(savingsMovements));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_loans`, JSON.stringify(loans));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_coop`, JSON.stringify(coopShares));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_assets`, JSON.stringify(assets));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_events`, JSON.stringify(calendarEvents));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifs`, JSON.stringify(notifications));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_logs`, JSON.stringify(activityLogs));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_baby`, JSON.stringify(babyItems));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_construction`, JSON.stringify(constructionItems));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_vehicle`, JSON.stringify(vehicleItems));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_offlineQueue`, JSON.stringify(offlineQueue));
  }, [
    user, family, wallets, categories, transactions, savingsFunds,
    savingsMovements, loans, coopShares, assets, calendarEvents,
    notifications, activityLogs, babyItems, constructionItems,
    vehicleItems, offlineQueue
  ]);

  // Fetch real exchange rates if online
  useEffect(() => {
    if (!navigator.onLine) return;
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.DOP) {
          const usdRate = parseFloat(data.rates.DOP.toFixed(2));
          setExchangeRates(prev => ({
            ...prev,
            BCRD_USD: usdRate,
            VIMENCA_USD: parseFloat((usdRate + 0.15).toFixed(2)),
          }));
        }
      })
      .catch(() => {});
  }, []);

  const togglePrivacyMode = () => {
    setIsPrivacyMode(prev => !prev);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const changePeriodDelta = (deltaMonths: number) => {
    const [yearStr, monthStr] = selectedPeriod.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const d = new Date(year, month - 1 + deltaMonths, 1);
    const newYear = d.getFullYear();
    const newMonth = String(d.getMonth() + 1).padStart(2, '0');
    setSelectedPeriod(`${newYear}-${newMonth}`);
  };

  const unlockWithPinOrBiometric = (credential?: string): boolean => {
    if (credential) {
      const clean = credential.trim();
      if (
        clean === user.pinCode ||
        clean === user.password
      ) {
        setIsBiometricLocked(false);
        return true;
      }
      const found = registeredUsers.find(
        u => u.pinCode === clean || u.password === clean
      );
      if (found) {
        if (found.id !== user.id) {
          saveUserBundle(user.id, getCurrentBundle());
          loadUserBundle(found);
        }
        setUser(found);
        setIsBiometricLocked(false);
        return true;
      }
      return false;
    }
    // Biometric success
    setIsBiometricLocked(false);
    return true;
  };

  const getCurrentBundle = () => ({
    wallets,
    categories,
    transactions,
    savingsFunds,
    savingsMovements,
    loans,
    coopShares,
    assets,
    calendarEvents,
    notifications,
    activityLogs,
    babyItems,
    constructionItems,
    vehicleItems,
  });

  const saveUserBundle = (userId: string, currentData: any) => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_userdata_${userId}`, JSON.stringify(currentData));
    } catch (e) {
      console.error('Error saving user data', e);
    }
  };

  const applyBundle = (bundle: any) => {
    if (bundle.wallets) setWallets(bundle.wallets);
    if (bundle.categories) setCategories(bundle.categories);
    if (bundle.transactions) setTransactions(bundle.transactions);
    if (bundle.savingsFunds) setSavingsFunds(bundle.savingsFunds);
    if (bundle.savingsMovements) setSavingsMovements(bundle.savingsMovements);
    if (bundle.loans) setLoans(bundle.loans);
    if (bundle.coopShares) setCoopShares(bundle.coopShares);
    if (bundle.assets) setAssets(bundle.assets);
    if (bundle.calendarEvents) setCalendarEvents(bundle.calendarEvents);
    if (bundle.notifications) setNotifications(bundle.notifications);
    if (bundle.activityLogs) setActivityLogs(bundle.activityLogs);
    if (bundle.babyItems) setBabyItems(bundle.babyItems);
    if (bundle.constructionItems) setConstructionItems(bundle.constructionItems);
    if (bundle.vehicleItems) setVehicleItems(bundle.vehicleItems);
  };

  const loadUserBundle = (targetUser: UserProfile) => {
    try {
      const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY}_userdata_${targetUser.id}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        applyBundle(parsed);
        return;
      }
    } catch (e) {
      console.error('Error loading user data', e);
    }

    if (targetUser.id === 'usr-1') {
      applyBundle({
        wallets: INITIAL_WALLETS,
        categories: INITIAL_CATEGORIES,
        transactions: INITIAL_TRANSACTIONS,
        savingsFunds: INITIAL_SAVINGS_FUNDS,
        savingsMovements: INITIAL_SAVINGS_MOVEMENTS,
        loans: INITIAL_LOANS,
        coopShares: INITIAL_COOP_SHARES,
        assets: INITIAL_ASSETS,
        calendarEvents: INITIAL_CALENDAR_EVENTS,
        notifications: INITIAL_NOTIFICATIONS,
        activityLogs: INITIAL_ACTIVITY_LOGS,
        babyItems: INITIAL_BABY_ITEMS,
        constructionItems: INITIAL_CONSTRUCTION_ITEMS,
        vehicleItems: INITIAL_VEHICLE_ITEMS,
      });
      return;
    }

    // New user default: EVERYTHING AT 0!
    const clean = getCleanUserState(targetUser.name);
    applyBundle(clean);
    saveUserBundle(targetUser.id, clean);
  };

  const lockApp = () => {
    setIsBiometricLocked(true);
  };

  const updateExchangeRates = (rates: Partial<ExchangeRates>) => {
    setExchangeRates(prev => ({ ...prev, ...rates }));
  };

  const logActivity = (action: string, details: string, section: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      userName: user.name,
      action,
      details,
      section,
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const pushNotification = (title: string, message: string, type: FamilyNotification['type'] = 'info') => {
    const newNotif: FamilyNotification = {
      id: `nt-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      title,
      message,
      type,
      read: false,
      author: user.name,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const recordOfflineAction = (actionType: string, payload: any) => {
    if (!navigator.onLine) {
      const offlineItem: OfflineAction = {
        id: `off-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actionType,
        payload,
        status: 'pending',
      };
      setOfflineQueue(prev => [...prev, offlineItem]);
    }
  };

  const syncOfflineQueue = () => {
    if (offlineQueue.length === 0) return;
    setOfflineQueue([]);
    pushNotification('Sincronización Exitosa', `Se sincronizaron ${offlineQueue.length} acciones pendientes con la nube.`, 'success');
  };

  // 1. Transaction additions
  const addTransaction = (tx: Omit<Transaction, 'id' | 'createdByUserName' | 'createdById'>) => {
    const newId = `tx-${Date.now()}`;
    const newTx: Transaction = {
      ...tx,
      id: newId,
      createdByUserName: user.name,
      createdById: user.id,
    };

    // Update wallet balance automatically
    setWallets(prev => prev.map(w => {
      if (w.id === tx.walletId) {
        const delta = tx.tipo === 'Ingreso' ? tx.montoDOP : -tx.montoDOP;
        const newDOP = Math.max(0, w.balanceDOP + delta);
        const newOrig = w.currency !== 'DOP' && tx.tasaCambio > 0 ? newDOP / tx.tasaCambio : newDOP;
        return { ...w, balanceDOP: newDOP, balanceOriginal: newOrig };
      }
      return w;
    }));

    setTransactions(prev => [newTx, ...prev]);
    recordOfflineAction('addTransaction', newTx);
    logActivity(
      tx.tipo === 'Ingreso' ? 'Ingreso Registrado' : 'Gasto Registrado',
      `RD$ ${tx.montoDOP.toFixed(2)} en ${tx.categoria} (${tx.walletNombre})`,
      'Presupuesto'
    );
    pushNotification(
      `${tx.tipo === 'Ingreso' ? '📈 Nuevo Ingreso' : '📉 Nuevo Gasto'}`,
      `${user.name} registró RD$ ${tx.montoDOP.toFixed(2)} en ${tx.categoria}`,
      tx.tipo === 'Ingreso' ? 'success' : 'info'
    );
  };

  const deleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    // Reverse wallet balance
    setWallets(prev => prev.map(w => {
      if (w.id === tx.walletId) {
        const reverseDelta = tx.tipo === 'Ingreso' ? -tx.montoDOP : tx.montoDOP;
        const newDOP = Math.max(0, w.balanceDOP + reverseDelta);
        return { ...w, balanceDOP: newDOP };
      }
      return w;
    }));

    setTransactions(prev => prev.filter(t => t.id !== id));
    logActivity('Transacción Eliminada', `Eliminó RD$ ${tx.montoDOP.toFixed(2)} (${tx.concepto})`, 'Presupuesto');
  };

  // 2. Inter-wallet transfers
  const transferWalletFunds = (sourceWalletId: string, destWalletId: string, amountDOP: number, concept?: string) => {
    const src = wallets.find(w => w.id === sourceWalletId);
    const dst = wallets.find(w => w.id === destWalletId);
    if (!src || !dst || amountDOP <= 0) return;

    setWallets(prev => prev.map(w => {
      if (w.id === sourceWalletId) return { ...w, balanceDOP: Math.max(0, w.balanceDOP - amountDOP) };
      if (w.id === destWalletId) return { ...w, balanceDOP: w.balanceDOP + amountDOP };
      return w;
    }));

    const today = new Date().toISOString().split('T')[0];
    const desc = concept || `Transferencia de ${src.name} a ${dst.name}`;

    // Add mirror transactions for audit
    const txOut: Transaction = {
      id: `tx-tf-out-${Date.now()}`,
      date: today,
      tipo: 'Gasto',
      categoria: 'Transferencia Entre Cuentas',
      concepto: `Salida hacia ${dst.name} (${desc})`,
      montoDOP: amountDOP,
      montoOriginal: amountDOP,
      moneda: 'DOP',
      tasaCambio: 1,
      walletId: src.id,
      walletNombre: src.name,
      createdByUserName: user.name,
    };

    const txIn: Transaction = {
      id: `tx-tf-in-${Date.now() + 1}`,
      date: today,
      tipo: 'Ingreso',
      categoria: 'Transferencia Entre Cuentas',
      concepto: `Entrada desde ${src.name} (${desc})`,
      montoDOP: amountDOP,
      montoOriginal: amountDOP,
      moneda: 'DOP',
      tasaCambio: 1,
      walletId: dst.id,
      walletNombre: dst.name,
      createdByUserName: user.name,
    };

    setTransactions(prev => [txOut, txIn, ...prev]);
    logActivity('Transferencia Entre Wallets', `RD$ ${amountDOP.toFixed(2)} de ${src.name} a ${dst.name}`, 'Wallets');
    pushNotification('Transferencia Realizada', `Se transfirieron RD$ ${amountDOP.toFixed(2)} de ${src.name} a ${dst.name}`, 'info');
  };

  // 3. Savings Funds Deposits & Routing
  const depositToSavingsFund = (
    fundId: string,
    sourceWalletId: string,
    destWalletId: string,
    amount: number,
    currency: CurrencyCode,
    rate: number,
    concept: string
  ) => {
    const fund = savingsFunds.find(f => f.id === fundId);
    const srcWallet = wallets.find(w => w.id === sourceWalletId);
    const dstWallet = wallets.find(w => w.id === destWalletId);
    if (!fund || !srcWallet || amount <= 0) return;

    const amountDOP = currency === 'DOP' ? amount : amount * rate;

    // Deduct from source wallet, add to target wallet if different
    setWallets(prev => prev.map(w => {
      if (w.id === sourceWalletId && w.id === destWalletId) {
        // Kept in same wallet, dedicated balance tracker
        return w;
      }
      if (w.id === sourceWalletId) return { ...w, balanceDOP: Math.max(0, w.balanceDOP - amountDOP) };
      if (w.id === destWalletId) return { ...w, balanceDOP: w.balanceDOP + amountDOP };
      return w;
    }));

    // Update fund amount
    setSavingsFunds(prev => prev.map(f => {
      if (f.id === fundId) return { ...f, currentAmountDOP: f.currentAmountDOP + amountDOP };
      return f;
    }));

    const movement: SavingsMovement = {
      id: `sm-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      fundId: fund.id,
      fundName: fund.name,
      tipo: 'Depósito',
      montoDOP: amountDOP,
      montoOriginal: amount,
      moneda: currency,
      tasaCambio: rate,
      walletOrigenId: srcWallet.id,
      walletOrigenNombre: srcWallet.name,
      walletDestinoId: dstWallet ? dstWallet.id : srcWallet.id,
      walletDestinoNombre: dstWallet ? dstWallet.name : srcWallet.name,
      concepto: concept || `Aporte a ${fund.name}`,
      createdByUserName: user.name,
    };

    setSavingsMovements(prev => [movement, ...prev]);
    logActivity('Aporte a Ahorros', `RD$ ${amountDOP.toFixed(2)} al ${fund.name}`, 'Ahorros');
    pushNotification('Aporte de Ahorro', `${user.name} aportó RD$ ${amountDOP.toFixed(2)} a ${fund.name}`, 'success');
  };

  const addSavingsFund = (fund: Omit<SavingsFund, 'id' | 'currentAmountDOP'>) => {
    const newFund: SavingsFund = {
      ...fund,
      id: `f-${Date.now()}`,
      currentAmountDOP: 0,
    };
    setSavingsFunds(prev => [...prev, newFund]);
    pushNotification('Nueva Meta Creada', `Se creó la meta: ${fund.name}`, 'info');
  };

  // 4. Loans & Debt payments
  const addLoan = (loan: Omit<Loan, 'id' | 'pagadoAcumuladoDOP' | 'saldoPendienteDOP'>) => {
    const newLoan: Loan = {
      ...loan,
      id: `ln-${Date.now()}`,
      pagadoAcumuladoDOP: 0,
      saldoPendienteDOP: loan.montoTotalDOP,
    };
    setLoans(prev => [...prev, newLoan]);
    logActivity('Nuevo Préstamo Registrado', `RD$ ${loan.montoTotalDOP.toFixed(2)} con ${loan.entidad}`, 'Préstamos');
  };

  const recordLoanPayment = (loanId: string, amountDOP: number, walletId: string, concept?: string) => {
    const loan = loans.find(l => l.id === loanId);
    const wallet = wallets.find(w => w.id === walletId);
    if (!loan || !wallet || amountDOP <= 0) return;

    // Deduct from wallet
    setWallets(prev => prev.map(w => {
      if (w.id === walletId) return { ...w, balanceDOP: Math.max(0, w.balanceDOP - amountDOP) };
      return w;
    }));

    // Update loan balances
    setLoans(prev => prev.map(l => {
      if (l.id === loanId) {
        const newPaid = l.pagadoAcumuladoDOP + amountDOP;
        const newPending = Math.max(0, l.montoTotalDOP - newPaid);
        return {
          ...l,
          pagadoAcumuladoDOP: newPaid,
          saldoPendienteDOP: newPending,
          status: newPending === 0 ? 'liquidado' : 'activo',
        };
      }
      return l;
    }));

    // Record as transaction expense
    const newTx: Transaction = {
      id: `tx-loan-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      tipo: 'Gasto',
      categoria: 'Pago de Préstamos y Deudas',
      concepto: concept || `Pago cuota ${loan.entidad}`,
      montoDOP: amountDOP,
      montoOriginal: amountDOP,
      moneda: 'DOP',
      tasaCambio: 1,
      walletId: wallet.id,
      walletNombre: wallet.name,
      createdByUserName: user.name,
    };
    setTransactions(prev => [newTx, ...prev]);

    logActivity('Pago de Préstamo', `RD$ ${amountDOP.toFixed(2)} a ${loan.entidad}`, 'Préstamos');
    pushNotification('Abono a Préstamo', `${user.name} pagó cuota de RD$ ${amountDOP.toFixed(2)} en ${loan.entidad}`, 'info');
  };

  // 5. Cooperative Shares
  const updateCoopShare = (coopId: string, amountDOP: number) => {
    setCoopShares(prev => prev.map(cp => {
      if (cp.id === coopId) {
        return {
          ...cp,
          montoDOP: amountDOP,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      }
      return cp;
    }));
    logActivity('Actualización Cooperativa', `Acciones actualizadas en RD$ ${amountDOP.toFixed(2)}`, 'Patrimonio');
  };

  // 6. Tangible Assets
  const addAssetPatrimonial = (asset: Omit<AssetPatrimonial, 'id'>) => {
    const newAsset: AssetPatrimonial = {
      ...asset,
      id: `as-${Date.now()}`,
    };
    setAssets(prev => [...prev, newAsset]);
    logActivity('Activo Registrado', `${asset.nombre} (RD$ ${asset.valorEstimadoDOP.toFixed(2)})`, 'Patrimonio');
  };

  const deleteAssetPatrimonial = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  // 7. Calendar
  const addCalendarEvent = (event: Omit<CalendarEvent, 'id' | 'completed'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `ev-${Date.now()}`,
      completed: false,
    };
    setCalendarEvents(prev => [...prev, newEvent]);
  };

  const toggleCalendarEventCompleted = (id: string) => {
    setCalendarEvents(prev => prev.map(ev => {
      if (ev.id === id) return { ...ev, completed: !ev.completed };
      return ev;
    }));
  };

  // 8. Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // 9. Special Modules
  const addBabyItem = (item: Omit<BabyItem, 'id'>) => {
    const newItem: BabyItem = { ...item, id: `bb-${Date.now()}` };
    setBabyItems(prev => [newItem, ...prev]);
  };

  const toggleBabyItemStatus = (id: string) => {
    setBabyItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, estado: item.estado === 'Pendiente' ? 'Comprado' : 'Pendiente' };
      }
      return item;
    }));
  };

  const addConstructionItem = (item: Omit<ConstructionItem, 'id'>) => {
    const newItem: ConstructionItem = { ...item, id: `cs-${Date.now()}` };
    setConstructionItems(prev => [newItem, ...prev]);
  };

  const addVehicleItem = (item: Omit<VehicleMaintenanceItem, 'id'>) => {
    const newItem: VehicleMaintenanceItem = { ...item, id: `vh-${Date.now()}` };
    setVehicleItems(prev => [newItem, ...prev]);
  };

  // 10. Family Management
  const joinFamilyWithCode = (code: string, newFamilyName?: string): boolean => {
    if (!code || code.trim().length < 4) return false;
    const cleanCode = code.trim().toUpperCase();
    const joinedName = newFamilyName || `Familia (${cleanCode})`;

    setFamily(prev => ({
      ...prev,
      name: joinedName,
      inviteCode: cleanCode,
      members: [
        ...prev.members,
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'member',
          avatar: user.avatar,
          joinedAt: new Date().toISOString().split('T')[0],
        }
      ]
    }));

    setUser(prev => ({
      ...prev,
      familyId: `fam-${cleanCode}`,
      familyName: joinedName,
      role: 'member',
    }));

    pushNotification('Familia Conectada', `Te has unido exitosamente al grupo familiar "${joinedName}"`, 'success');
    return true;
  };

  const generateNewInviteCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let rand = '';
    for (let i = 0; i < 4; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const newCode = `FAM-${Math.floor(1000 + Math.random() * 9000)}-${rand}`;
    setFamily(prev => ({ ...prev, inviteCode: newCode }));
    pushNotification('Código de Invitación', `Se generó un nuevo código privado: ${newCode}`, 'info');
    return newCode;
  };

  const updateMemberRole = (memberId: string, newRole: UserProfile['role']) => {
    setFamily(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === memberId ? { ...m, role: newRole } : m),
    }));
    if (memberId === user.id) {
      setUser(prev => ({ ...prev, role: newRole }));
    }
    pushNotification('Rol Actualizado', `Se actualizó el rol a "${newRole.toUpperCase()}"`, 'info');
  };

  // Money formatting helper with safety guards and privacy mode support
  const formatMoney = (amount?: number | null, currency: CurrencyCode = 'DOP'): string => {
    if (amount === undefined || amount === null || typeof amount !== 'number' || isNaN(amount)) {
      const prefix = currency === 'DOP' ? 'RD$' : currency === 'USD' ? '$' : '€';
      return `${prefix} 0.00`;
    }
    const formatted = amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const prefix = currency === 'DOP' ? 'RD$' : currency === 'USD' ? '$' : '€';
    return `${prefix} ${formatted}`;
  };

  const depositToFund = (fundId: string, amount: number, sourceWalletId?: string) => {
    const srcId = sourceWalletId || wallets[0]?.id || '';
    depositToSavingsFund(fundId, srcId, srcId, amount, 'DOP', 1, '');
  };

  const payLoanInstallment = (loanId: string, amount: number, walletId?: string, notes?: string) => {
    const wId = walletId || wallets[0]?.id || '';
    recordLoanPayment(loanId, amount, wId, notes);
  };

  const addAsset = (asset: Omit<AssetPatrimonial, 'id'>) => {
    addAssetPatrimonial(asset);
  };

  const deleteAsset = (id: string) => {
    deleteAssetPatrimonial(id);
  };

  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    setCategories(prev => [...prev, newCategory]);
    pushNotification('Nueva Categoría', `Se creó la categoría "${newCategory.name}"`, 'success');
  };

  const updateCategoryBudget = (categoryId: string, newBudget: number) => {
    setCategories(prev =>
      prev.map(c => (c.id === categoryId ? { ...c, budgetMonthly: newBudget } : c))
    );
    pushNotification('Presupuesto Actualizado', 'Se actualizó el límite presupuestario.', 'info');
  };

  // User Management, Registration, Login & Email Recovery
  const registerNewUser = (
    name: string,
    email: string,
    pin: string,
    role: UserProfile['role'] = 'member',
    inviteCode?: string
  ): { success: boolean; message: string; user?: UserProfile } => {
    const trimmedName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanSecret = pin.trim();

    if (!trimmedName) {
      return { success: false, message: 'El nombre completo es obligatorio.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, message: 'Por favor introduce un correo electrónico válido.' };
    }
    if (cleanSecret.length < 4) {
      return { success: false, message: 'La contraseña o PIN debe contener al menos 4 caracteres.' };
    }

    const existing = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'Ya existe una cuenta con este correo electrónico.' };
    }

    const initials = trimmedName.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();

    // Check invite code
    let targetFamilyId = family.id;
    let targetFamilyName = family.name;

    if (inviteCode && inviteCode.trim().length >= 4) {
      const code = inviteCode.trim().toUpperCase();
      if (code === family.inviteCode.toUpperCase()) {
        targetFamilyId = family.id;
        targetFamilyName = family.name;
      } else {
        targetFamilyId = `fam-${code}`;
        targetFamilyName = `Familia (${code})`;
      }
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: trimmedName,
      email: cleanEmail,
      role,
      avatar: initials || 'US',
      familyId: targetFamilyId,
      familyName: targetFamilyName,
      pinCode: cleanSecret,
      password: cleanSecret,
      biometricEnabled: true,
    };

    // Save previous user's active session state
    if (user && user.id) {
      saveUserBundle(user.id, getCurrentBundle());
    }

    // Initialize clean 0.00 state for brand-new registered user
    const clean = getCleanUserState(trimmedName);
    applyBundle(clean);
    saveUserBundle(newUser.id, clean);

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_registered_users`, JSON.stringify(updatedUsers));
    setUser(newUser);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(newUser));
    setIsBiometricLocked(false);

    // Add to family members
    setFamily(prev => ({
      ...prev,
      members: [
        ...prev.members.filter(m => m.email.toLowerCase() !== cleanEmail),
        {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: newUser.avatar,
          joinedAt: new Date().toISOString().split('T')[0],
        }
      ]
    }));

    pushNotification(
      'Cuenta Creada en 0 y Confirmación Enviada',
      `¡Bienvenido/a ${trimmedName}! Tu cuenta inicia limpia con saldos en 0. Se ha enviado un correo a ${cleanEmail} con tu confirmación de registro.`,
      'success'
    );

    return {
      success: true,
      message: `Cuenta registrada exitosamente con saldos en 0. Correo de confirmación enviado a ${cleanEmail}.`,
      user: newUser
    };
  };

  const loginUser = (emailOrName: string, pinOrPassword: string): { success: boolean; message: string } => {
    const q = emailOrName.trim().toLowerCase();
    const cleanSecret = pinOrPassword.trim();

    let found = registeredUsers.find(
      u =>
        u.email.toLowerCase() === q ||
        u.name.toLowerCase() === q ||
        (q === 'jmercado' && (u.email.toLowerCase().includes('juan') || u.name.toLowerCase().includes('juan') || u.id === 'usr-1')) ||
        (q === 'admin' && u.role === 'admin')
    );

    if (!found && user) {
      if (
        user.email.toLowerCase() === q ||
        user.name.toLowerCase() === q ||
        (q === 'jmercado' && (user.email.toLowerCase().includes('juan') || user.id === 'usr-1')) ||
        (q === 'admin' && user.role === 'admin')
      ) {
        found = user;
      }
    }

    if (!found) {
      return { success: false, message: 'No se encontró ningún usuario con ese correo o nombre.' };
    }

    const isValid = (
      cleanSecret === found.password ||
      cleanSecret === found.pinCode
    );

    if (!isValid) {
      return { success: false, message: 'Contraseña o PIN incorrecto.' };
    }

    if (found.id !== user.id) {
      if (user && user.id) {
        saveUserBundle(user.id, getCurrentBundle());
      }
      loadUserBundle(found);
    }

    setUser(found);
    setIsBiometricLocked(false);
    pushNotification('Sesión Iniciada', `Has iniciado sesión como ${found.name}`, 'info');
    return { success: true, message: `Sesión iniciada como ${found.name}` };
  };

  const switchActiveUser = (userId: string) => {
    const target = registeredUsers.find(u => u.id === userId);
    if (target) {
      if (user && user.id && user.id !== target.id) {
        saveUserBundle(user.id, getCurrentBundle());
        loadUserBundle(target);
      }
      setUser(target);
      setIsBiometricLocked(false);
      pushNotification('Usuario Activo', `Ahora estás operando como ${target.name}`, 'info');
    }
  };

  const changePassword = (currentSecret: string, newSecret: string): { success: boolean; message: string } => {
    const currentClean = currentSecret.trim();
    const newClean = newSecret.trim();

    if (!currentClean) {
      return { success: false, message: 'Por favor ingresa la contraseña o PIN actual.' };
    }

    const isMatch = (
      currentClean === user.password ||
      currentClean === user.pinCode
    );

    if (!isMatch) {
      return { success: false, message: 'La contraseña o PIN actual no es correcta.' };
    }

    if (newClean.length < 4) {
      return { success: false, message: 'La nueva contraseña debe tener al menos 4 caracteres.' };
    }

    const updatedUser: UserProfile = {
      ...user,
      pinCode: newClean,
      password: newClean,
    };

    setUser(updatedUser);
    const userExists = registeredUsers.some(u => u.id === user.id);
    const updatedUsers = userExists
      ? registeredUsers.map(u => (u.id === user.id ? { ...u, pinCode: newClean, password: newClean } : u))
      : [...registeredUsers, updatedUser];
    setRegisteredUsers(updatedUsers);

    localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(updatedUser));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_registered_users`, JSON.stringify(updatedUsers));

    pushNotification(
      'Clave Actualizada',
      'Tu contraseña o PIN de acceso ha sido actualizado con éxito.',
      'success'
    );

    return { success: true, message: '¡Contraseña actualizada exitosamente!' };
  };

  const resetUserDataToZero = () => {
    const clean = getCleanUserState(user.name);
    applyBundle(clean);
    saveUserBundle(user.id, clean);
    pushNotification('Cuenta en 0', 'Todos los saldos y transacciones de tu cuenta han sido restablecidos a 0.00.', 'info');
  };

  const recoverUserAccount = (email: string): { success: boolean; message: string; tempPin?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const found = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return {
        success: false,
        message: 'No existe ningún usuario registrado con el correo ingresado.'
      };
    }

    pushNotification(
      'Correo de Recuperación Enviado',
      `📧 Se ha enviado un correo a ${cleanEmail} para el usuario "${found.name}". Tu PIN de acceso recuperado es: ${found.pinCode}`,
      'info'
    );

    return {
      success: true,
      message: `Se ha enviado el correo con las instrucciones de recuperación a ${cleanEmail}.`,
      tempPin: found.pinCode
    };
  };

  const resetAllData = () => {
    setUser(INITIAL_USER);
    setFamily(INITIAL_FAMILY);
    setWallets(INITIAL_WALLETS);
    setCategories(INITIAL_CATEGORIES);
    setTransactions(INITIAL_TRANSACTIONS);
    setSavingsFunds(INITIAL_SAVINGS_FUNDS);
    setSavingsMovements(INITIAL_SAVINGS_MOVEMENTS);
    setLoans(INITIAL_LOANS);
    setCoopShares(INITIAL_COOP_SHARES);
    setAssets(INITIAL_ASSETS);
    setCalendarEvents(INITIAL_CALENDAR_EVENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setBabyItems(INITIAL_BABY_ITEMS);
    setConstructionItems(INITIAL_CONSTRUCTION_ITEMS);
    setVehicleItems(INITIAL_VEHICLE_ITEMS);
    setOfflineQueue([]);
    localStorage.clear();
  };

  return (
    <FinancialContext.Provider
      value={{
        user,
        setUser,
        registeredUsers,
        registerNewUser,
        loginUser,
        changePassword,
        resetUserDataToZero,
        switchActiveUser,
        recoverUserAccount,
        family,
        setFamily,
        isBiometricLocked,
        setIsBiometricLocked,
        unlockWithPinOrBiometric,
        lockApp,
        isPrivacyMode,
        togglePrivacyMode,
        theme,
        toggleTheme,
        selectedPeriod,
        setSelectedPeriod,
        changePeriodDelta,
        exchangeRates,
        setExchangeRates,
        updateExchangeRates,
        wallets,
        categories,
        transactions,
        savingsFunds,
        savingsMovements,
        loans,
        coopShares,
        assets,
        calendarEvents,
        notifications,
        activityLogs,
        babyItems,
        constructionItems,
        vehicleItems,
        isOnline,
        offlineQueue,
        syncOfflineQueue,
        addTransaction,
        deleteTransaction,
        transferWalletFunds,
        depositToSavingsFund,
        depositToFund,
        addSavingsFund,
        addLoan,
        recordLoanPayment,
        payLoanInstallment,
        updateCoopShare,
        addAssetPatrimonial,
        addAsset,
        deleteAssetPatrimonial,
        deleteAsset,
        addCalendarEvent,
        toggleCalendarEventCompleted,
        markNotificationAsRead,
        clearAllNotifications,
        addBabyItem,
        toggleBabyItemStatus,
        addConstructionItem,
        addVehicleItem,
        addCategory,
        updateCategoryBudget,
        joinFamilyWithCode,
        generateNewInviteCode,
        updateMemberRole,
        formatMoney,
        resetAllData,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
