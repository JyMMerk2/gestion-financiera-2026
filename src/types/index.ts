export type UserRole = 'admin' | 'member' | 'contributor' | 'viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  familyId: string;
  familyName: string;
  pinCode: string;
  biometricEnabled: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  joinedAt: string;
}

export interface FamilyGroup {
  id: string;
  name: string;
  inviteCode: string;
  createdAt: string;
  createdBy: string;
  members: FamilyMember[];
}

export type CurrencyCode = 'DOP' | 'USD' | 'EUR';
export type CurrencyType = CurrencyCode;
export type TransactionType = 'Ingreso' | 'Gasto';

export interface ExchangeRates {
  BCRD_USD: number;
  VIMENCA_USD: number;
  CARIBE_USD: number;
  EUR_DOP: number;
}

export interface Wallet {
  id: string;
  name: string;
  icon: string;
  balanceDOP: number;
  currency: CurrencyCode;
  balanceOriginal?: number;
  accountNumber?: string;
  color?: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: 'ingreso' | 'gasto';
  budgetMonthly?: number;
}

export type RecurrenceInterval = 'ninguna' | 'semanal' | 'quincenal' | 'mensual' | 'anual';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  tipo: 'Ingreso' | 'Gasto';
  categoria: string;
  concepto: string;
  montoDOP: number;
  montoOriginal: number;
  moneda: CurrencyCode;
  tasaCambio: number;
  walletId: string;
  walletNombre: string;
  isRecurring?: boolean;
  recurrenceInterval?: RecurrenceInterval;
  nextDueDate?: string;
  createdByUserName?: string;
  createdById?: string;
}

export interface SavingsFund {
  id: string;
  name: string;
  icon: string;
  targetAmountDOP: number;
  currentAmountDOP: number;
  destWalletId?: string;
  targetDate?: string;
  notes?: string;
}

export interface SavingsMovement {
  id: string;
  date: string;
  fundId: string;
  fundName: string;
  tipo: 'Depósito' | 'Retiro';
  montoDOP: number;
  montoOriginal: number;
  moneda: CurrencyCode;
  tasaCambio: number;
  walletOrigenId: string;
  walletOrigenNombre: string;
  walletDestinoId: string;
  walletDestinoNombre: string;
  concepto: string;
  createdByUserName?: string;
}

export interface Loan {
  id: string;
  entidad: string;
  walletAfectadaId: string;
  walletAfectadaNombre: string;
  montoTotalDOP: number;
  cuotaMensualDOP: number;
  pagadoAcumuladoDOP: number;
  saldoPendienteDOP: number;
  tipo: 'Préstamo Personal' | 'Préstamo Hipotecario' | 'Préstamo Vehículo' | 'Tarjeta de Crédito' | 'Prestador Informal';
  fechaInicio: string;
  proximaFechaVencimiento: string;
  notas?: string;
  tasaInteresAnual?: number;
}

export interface LoanPayment {
  id: string;
  loanId: string;
  date: string;
  montoDOP: number;
  walletId: string;
  walletNombre: string;
  concepto: string;
}

export interface CoopShare {
  id: string;
  coopName: string;
  montoDOP: number;
  lastUpdated: string;
  dividendYield?: number;
}

export interface AssetPatrimonial {
  id: string;
  nombre: string;
  tipo: 'Inmueble / Solar' | 'Vehículo' | 'Inversión / Acciones' | 'Bien de Valor' | 'Otro';
  valorEstimadoDOP: number;
  fechaAdquisicion: string;
  notas?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  tipo: 'pago_prestamo' | 'ingreso' | 'gasto' | 'meta' | 'familiar';
  amountDOP?: number;
  completed: boolean;
  assignedUserName?: string;
}

export interface FamilyNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'alert';
  read: boolean;
  author: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userName: string;
  action: string;
  details: string;
  section: string;
}

export interface BabyItem {
  id: string;
  fecha: string;
  articulo: string;
  categoria: 'Compras Bebé' | 'Consulta / Clínica' | 'Ropa y Accesorios';
  costoDOP: number;
  estado: 'Pendiente' | 'Comprado';
}

export interface ConstructionItem {
  id: string;
  fecha: string;
  proyecto: 'Terreno / Solar' | 'Construcción Casa' | 'Mejora Inmueble';
  concepto: string;
  montoDOP: number;
}

export interface VehicleMaintenanceItem {
  id: string;
  fecha: string;
  vehiculo: string;
  tipo: 'Mantenimiento' | 'Combustible';
  concepto: string;
  millasKm: number;
  costoDOP: number;
}

export interface OfflineAction {
  id: string;
  timestamp: string;
  actionType: string;
  payload: any;
  status: 'pending' | 'synced' | 'failed';
}
