import {
  UserProfile,
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
  ExchangeRates
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr-1',
  name: 'Juan Mercado',
  email: 'juan.mercado@dr.boombah.com',
  role: 'admin',
  avatar: 'JM',
  familyId: 'fam-1',
  familyName: 'Familia Mercado',
  pinCode: '1234',
  biometricEnabled: true,
};

export const INITIAL_REGISTERED_USERS: UserProfile[] = [
  INITIAL_USER,
  {
    id: 'usr-2',
    name: 'Pamely Mercado',
    email: 'pamely@dr.boombah.com',
    role: 'member',
    avatar: 'PM',
    familyId: 'fam-1',
    familyName: 'Familia Mercado',
    pinCode: '4321',
    biometricEnabled: true,
  },
];

export const INITIAL_FAMILY: FamilyGroup = {
  id: 'fam-1',
  name: 'Familia Mercado',
  inviteCode: 'FAM-8492-DR',
  createdAt: '2026-01-15',
  createdBy: 'Juan Mercado',
  members: [
    {
      id: 'usr-1',
      name: 'Juan Mercado',
      email: 'juan.mercado@dr.boombah.com',
      role: 'admin',
      avatar: 'JM',
      joinedAt: '2026-01-15',
    },
    {
      id: 'usr-2',
      name: 'Pamely Mercado',
      email: 'pamely@dr.boombah.com',
      role: 'member',
      avatar: 'PM',
      joinedAt: '2026-01-16',
    },
  ],
};

export const INITIAL_EXCHANGE_RATES: ExchangeRates = {
  BCRD_USD: 58.71,
  VIMENCA_USD: 58.85,
  CARIBE_USD: 57.75,
  EUR_DOP: 68.48,
};

export const INITIAL_WALLETS: Wallet[] = [
  { id: 'w-1', name: 'Banreservas', icon: '🏦', balanceDOP: 12540.50, currency: 'DOP', color: '#10b981', isDefault: true },
  { id: 'w-2', name: 'Banco Popular', icon: '🔵', balanceDOP: 8430.25, currency: 'DOP', color: '#3b82f6' },
  { id: 'w-3', name: 'Banco BHD', icon: '🏢', balanceDOP: 5120.00, currency: 'DOP', color: '#6366f1' },
  { id: 'w-4', name: 'Banco Santa Cruz', icon: '🏥', balanceDOP: 3200.00, currency: 'DOP', color: '#14b8a6' },
  { id: 'w-5', name: 'Asoc. CIBAO', icon: '🏛️', balanceDOP: 6150.00, currency: 'DOP', color: '#f59e0b' },
  { id: 'w-6', name: 'Efectivo Físico', icon: '💵', balanceDOP: 2800.00, currency: 'DOP', color: '#84cc16' },
  { id: 'w-7', name: 'Billetera USD ($)', icon: '🌎', balanceDOP: 14687.50, currency: 'USD', balanceOriginal: 250.00, color: '#00f2fe' },
];

export const INITIAL_COOP_SHARES: CoopShare[] = [
  { id: 'cp-1', coopName: '⛰️ Coop La Altagracia', montoDOP: 29177.80, lastUpdated: '2026-08-20', dividendYield: 8.5 },
  { id: 'cp-2', coopName: '🤝 Coop Mamoncito', montoDOP: 2553.60, lastUpdated: '2026-08-15', dividendYield: 7.2 },
  { id: 'cp-3', coopName: '🤝 CoopSanJosé', montoDOP: 235.00, lastUpdated: '2026-07-30', dividendYield: 6.8 },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Sueldo Principal', icon: '💼', type: 'ingreso' },
  { id: 'cat-2', name: 'Sueldo Secundario / Bonos', icon: '⭐', type: 'ingreso' },
  { id: 'cat-3', name: 'Ingresos Extras / Negocios', icon: '📈', type: 'ingreso' },
  { id: 'cat-4', name: 'Comida & Supermercado', icon: '🛒', type: 'gasto', budgetMonthly: 25000 },
  { id: 'cat-5', name: 'Servicios (Luz, Agua, Internet)', icon: '💡', type: 'gasto', budgetMonthly: 8500 },
  { id: 'cat-6', name: '🎉 Diversión, Salidas & Restaurantes', icon: '🍽️', type: 'gasto', budgetMonthly: 12000 },
  { id: 'cat-7', name: 'Salud & Farmacia', icon: '💊', type: 'gasto', budgetMonthly: 6000 },
  { id: 'cat-8', name: 'Combustible & Transporte', icon: '⛽', type: 'gasto', budgetMonthly: 9000 },
  { id: 'cat-9', name: '✈️ Viajes & Vacaciones', icon: '🏖️', type: 'gasto', budgetMonthly: 15000 },
  { id: 'cat-10', name: 'Mantenimiento Casa', icon: '🏡', type: 'gasto', budgetMonthly: 5000 },
  { id: 'cat-11', name: 'Acciones / Inversión', icon: '📊', type: 'ambos' as any },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    date: '2026-08-01',
    tipo: 'Ingreso',
    categoria: 'Sueldo Principal',
    concepto: 'Pago Primera Quincena Empresa',
    montoDOP: 35000.00,
    montoOriginal: 35000.00,
    moneda: 'DOP',
    tasaCambio: 1,
    walletId: 'w-1',
    walletNombre: 'Banreservas',
    isRecurring: true,
    recurrenceInterval: 'quincenal',
    nextDueDate: '2026-08-15',
    createdByUserName: 'Juan Mercado',
  },
  {
    id: 'tx-2',
    date: '2026-08-03',
    tipo: 'Gasto',
    categoria: 'Comida & Supermercado',
    concepto: 'Compra quincenal Bravo / Sirena',
    montoDOP: 7450.00,
    montoOriginal: 7450.00,
    moneda: 'DOP',
    tasaCambio: 1,
    walletId: 'w-2',
    walletNombre: 'Banco Popular',
    createdByUserName: 'Pamely Mercado',
  },
  {
    id: 'tx-3',
    date: '2026-08-05',
    tipo: 'Gasto',
    categoria: 'Servicios (Luz, Agua, Internet)',
    concepto: 'Pago Electricidad EDEESTE',
    montoDOP: 3250.00,
    montoOriginal: 3250.00,
    moneda: 'DOP',
    tasaCambio: 1,
    walletId: 'w-1',
    walletNombre: 'Banreservas',
    isRecurring: true,
    recurrenceInterval: 'mensual',
    nextDueDate: '2026-09-05',
    createdByUserName: 'Juan Mercado',
  },
  {
    id: 'tx-4',
    date: '2026-08-08',
    tipo: 'Gasto',
    categoria: 'Combustible & Transporte',
    concepto: 'Llenado tanque Gasolina Murano',
    montoDOP: 3400.00,
    montoOriginal: 3400.00,
    moneda: 'DOP',
    tasaCambio: 1,
    walletId: 'w-2',
    walletNombre: 'Banco Popular',
    createdByUserName: 'Juan Mercado',
  },
  {
    id: 'tx-5',
    date: '2026-08-10',
    tipo: 'Ingreso',
    categoria: 'Ingresos Extras / Negocios',
    concepto: 'Cobro de asesoría técnica USD [USD $200 @ 58.71]',
    montoDOP: 11742.00,
    montoOriginal: 200.00,
    moneda: 'USD',
    tasaCambio: 58.71,
    walletId: 'w-7',
    walletNombre: 'Billetera USD ($)',
    createdByUserName: 'Juan Mercado',
  },
  {
    id: 'tx-6',
    date: '2026-08-12',
    tipo: 'Gasto',
    categoria: '🎉 Diversión, Salidas & Restaurantes',
    concepto: 'Cena familiar fin de semana',
    montoDOP: 2450.00,
    montoOriginal: 2450.00,
    moneda: 'DOP',
    tasaCambio: 1,
    walletId: 'w-3',
    walletNombre: 'Banco BHD',
    createdByUserName: 'Pamely Mercado',
  },
];

export const INITIAL_SAVINGS_FUNDS: SavingsFund[] = [
  { id: 'f-1', name: 'Fondo Bebé 👶', icon: '👶', targetAmountDOP: 120000.00, currentAmountDOP: 45000.00, destWalletId: 'w-1', targetDate: '2026-12-31', notes: 'Preparativos para la llegada del bebé' },
  { id: 'f-2', name: 'Fondo Casa / Solar 🏡', icon: '🏡', targetAmountDOP: 500000.00, currentAmountDOP: 185000.00, destWalletId: 'w-5', targetDate: '2027-06-30', notes: 'Inicial para solar o construcción' },
  { id: 'f-3', name: 'Fondo Vacaciones y Viajes ✈️', icon: '✈️', targetAmountDOP: 80000.00, currentAmountDOP: 26000.00, destWalletId: 'w-2', targetDate: '2026-11-20', notes: 'Viaje familiar de fin de año' },
  { id: 'f-4', name: 'Fondo Mantenimiento Vehículo 🚗', icon: '🚗', targetAmountDOP: 40000.00, currentAmountDOP: 18500.00, destWalletId: 'w-1', notes: 'Gomas, seguro y cambio de fluidos' },
  { id: 'f-5', name: 'Fondo Emergencia 🚨', icon: '🚨', targetAmountDOP: 150000.00, currentAmountDOP: 72000.00, destWalletId: 'w-4', notes: '3 a 6 meses de gastos básicos' },
];

export const INITIAL_SAVINGS_MOVEMENTS: SavingsMovement[] = [
  {
    id: 'sm-1',
    date: '2026-08-02',
    fundId: 'f-1',
    fundName: 'Fondo Bebé 👶',
    tipo: 'Depósito',
    montoDOP: 5000.00,
    montoOriginal: 5000.00,
    moneda: 'DOP',
    tasaCambio: 1,
    walletOrigenId: 'w-1',
    walletOrigenNombre: 'Banreservas',
    walletDestinoId: 'w-1',
    walletDestinoNombre: 'Banreservas',
    concepto: 'Aporte quincenal bebé',
    createdByUserName: 'Juan Mercado',
  },
  {
    id: 'sm-2',
    date: '2026-08-04',
    fundId: 'f-2',
    fundName: 'Fondo Casa / Solar 🏡',
    tipo: 'Depósito',
    montoDOP: 10000.00,
    montoOriginal: 10000.00,
    moneda: 'DOP',
    tasaCambio: 1,
    walletOrigenId: 'w-1',
    walletOrigenNombre: 'Banreservas',
    walletDestinoId: 'w-5',
    walletDestinoNombre: 'Asoc. CIBAO',
    concepto: 'Aporte mensual solar',
    createdByUserName: 'Juan Mercado',
  },
];

export const INITIAL_LOANS: Loan[] = [
  {
    id: 'ln-1',
    entidad: 'Banco Popular',
    walletAfectadaId: 'w-2',
    walletAfectadaNombre: 'Banco Popular',
    montoTotalDOP: 250000.00,
    cuotaMensualDOP: 7850.00,
    pagadoAcumuladoDOP: 110000.00,
    saldoPendienteDOP: 140000.00,
    tipo: 'Préstamo Personal',
    fechaInicio: '2025-06-15',
    proximaFechaVencimiento: '2026-08-25',
    tasaInteresAnual: 14.5,
    notas: 'Cuota vence los días 25 de cada mes',
  },
  {
    id: 'ln-2',
    entidad: 'Banco BHD (Tarjeta)',
    walletAfectadaId: 'w-3',
    walletAfectadaNombre: 'Banco BHD',
    montoTotalDOP: 35000.00,
    cuotaMensualDOP: 5000.00,
    pagadoAcumuladoDOP: 18000.00,
    saldoPendienteDOP: 17000.00,
    tipo: 'Tarjeta de Crédito',
    fechaInicio: '2026-05-10',
    proximaFechaVencimiento: '2026-08-28',
    tasaInteresAnual: 28.0,
    notas: 'Pagar antes de fecha límite para evitar mora',
  },
];

export const INITIAL_ASSETS: AssetPatrimonial[] = [
  { id: 'as-1', nombre: 'Solar / Terreno Campestre 500m2', tipo: 'Inmueble / Solar', valorEstimadoDOP: 650000.00, fechaAdquisicion: '2024-03-10', notas: 'Ubicación con alta plusvalía' },
  { id: 'as-2', nombre: 'Nissan Murano 2017', tipo: 'Vehículo', valorEstimadoDOP: 750000.00, fechaAdquisicion: '2023-11-15', notas: 'Buen estado mecánico' },
  { id: 'as-3', nombre: 'Acciones Cooperativas Totales', tipo: 'Inversión / Acciones', valorEstimadoDOP: 31966.40, fechaAdquisicion: '2024-01-01', notas: 'Coop La Altagracia, Mamoncito, San José' },
  { id: 'as-4', nombre: 'Joyería y Relojería de Colección', tipo: 'Bien de Valor', valorEstimadoDOP: 65000.00, fechaAdquisicion: '2025-02-14' },
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'ev-1', title: 'Pago Cuota Préstamo Banco Popular', date: '2026-08-25', tipo: 'pago_prestamo', amountDOP: 7850.00, completed: false, assignedUserName: 'Juan Mercado' },
  { id: 'ev-2', title: 'Pago Tarjeta Banco BHD', date: '2026-08-28', tipo: 'pago_prestamo', amountDOP: 5000.00, completed: false, assignedUserName: 'Pamely Mercado' },
  { id: 'ev-3', title: 'Cobro Segunda Quincena', date: '2026-08-30', tipo: 'ingreso', amountDOP: 35000.00, completed: false, assignedUserName: 'Juan Mercado' },
  { id: 'ev-4', title: 'Consulta Prenatal Bebé', date: '2026-08-22', time: '10:00 AM', tipo: 'familiar', completed: false, assignedUserName: 'Pamely Mercado' },
  { id: 'ev-5', title: 'Mantenimiento Preventivo Vehículo', date: '2026-09-02', tipo: 'gasto', amountDOP: 3500.00, completed: false, assignedUserName: 'Juan Mercado' },
];

export const INITIAL_NOTIFICATIONS: FamilyNotification[] = [
  { id: 'nt-1', timestamp: '2026-08-14 09:30', title: 'Aporte de Ahorro', message: 'Juan agregó RD$ 5,000.00 al Fondo Bebé 👶', type: 'success', read: false, author: 'Juan Mercado' },
  { id: 'nt-2', timestamp: '2026-08-13 14:10', title: 'Gasto Registrado', message: 'Pamely registró compra en Supermercado por RD$ 7,450.00', type: 'info', read: false, author: 'Pamely Mercado' },
  { id: 'nt-3', timestamp: '2026-08-12 18:00', title: 'Recordatorio de Pago', message: 'Faltan 13 días para vencer la cuota de Banco Popular (RD$ 7,850.00)', type: 'warning', read: true, author: 'Sistema' },
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'al-1', timestamp: '2026-08-14 09:30', userName: 'Juan Mercado', action: 'Depósito a Fondo', details: 'RD$ 5,000.00 a Fondo Bebé', section: 'Ahorros' },
  { id: 'al-2', timestamp: '2026-08-13 14:10', userName: 'Pamely Mercado', action: 'Gasto Creado', details: 'RD$ 7,450.00 en Comida & Supermercado', section: 'Presupuesto' },
  { id: 'al-3', timestamp: '2026-08-10 11:20', userName: 'Juan Mercado', action: 'Ingreso Multi-moneda', details: 'USD $200.00 (RD$ 11,742.00) Billetera USD', section: 'Presupuesto' },
];

export const INITIAL_BABY_ITEMS: BabyItem[] = [
  { id: 'bb-1', fecha: '2026-07-20', articulo: 'Cuna de madera convertible', categoria: 'Compras Bebé', costoDOP: 14500.00, estado: 'Comprado' },
  { id: 'bb-2', fecha: '2026-08-02', articulo: 'Cochecito y Silla de Auto homologada', categoria: 'Compras Bebé', costoDOP: 19800.00, estado: 'Comprado' },
  { id: 'bb-3', fecha: '2026-08-10', articulo: 'Set de sábanas y cobijas hipoalergénicas', categoria: 'Ropa y Accesorios', costoDOP: 3200.00, estado: 'Comprado' },
  { id: 'bb-4', fecha: '2026-08-25', articulo: 'Biberones, esterilizador y extractor', categoria: 'Compras Bebé', costoDOP: 8500.00, estado: 'Pendiente' },
  { id: 'bb-5', fecha: '2026-09-05', articulo: 'Consulta ecografía Doppler 4D', categoria: 'Consulta / Clínica', costoDOP: 4500.00, estado: 'Pendiente' },
];

export const INITIAL_CONSTRUCTION_ITEMS: ConstructionItem[] = [
  { id: 'cs-1', fecha: '2026-06-15', proyecto: 'Terreno / Solar', concepto: 'Abono cuota compra de solar', montoDOP: 25000.00 },
  { id: 'cs-2', fecha: '2026-07-10', proyecto: 'Terreno / Solar', concepto: 'Trámite de deslinde y agrimensura', montoDOP: 12000.00 },
  { id: 'cs-3', fecha: '2026-08-01', proyecto: 'Construcción Casa', concepto: 'Planos preliminares y render arquitectónico', montoDOP: 18000.00 },
];

export const INITIAL_VEHICLE_ITEMS: VehicleMaintenanceItem[] = [
  { id: 'vh-1', fecha: '2026-07-15', vehiculo: 'Nissan Murano 2017', tipo: 'Mantenimiento', concepto: 'Cambio de aceite sintético 5W-30 y filtro', millasKm: 80918, costoDOP: 4200.00 },
  { id: 'vh-2', fecha: '2026-08-08', vehiculo: 'Nissan Murano 2017', tipo: 'Combustible', concepto: 'Gasolina Premium Estación Shell', millasKm: 81240, costoDOP: 3400.00 },
  { id: 'vh-3', fecha: '2026-08-12', vehiculo: 'Nissan Murano 2017', tipo: 'Mantenimiento', concepto: 'Alineación y balanceo computarizado', millasKm: 81350, costoDOP: 1800.00 },
];
