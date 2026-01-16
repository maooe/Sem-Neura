
export enum TransactionType {
  PAYABLE = 'PAGAR',
  RECEIVABLE = 'RECEBER'
}

export type CategoryKind = 'FIXED' | 'VARIABLE' | 'RECURRING';

export type ExtendedStatus = 'PAID' | 'OPEN' | 'SCHEDULED' | 'OVERDUE' | 'CANCELLED' | 'FROZEN' | 'OTHER';

export type PaymentMethod = 'PIX' | 'BOLETO' | 'CARD' | 'CASH' | 'OTHER';

export type ThemeType = 'classic' | 'emerald' | 'sunset' | 'purple' | 'midnight';

export interface ThemeColors {
  primary: string;
  secondary: string;
  light: string;
  accent: string;
  dark: string;
  shadow: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: ExtendedStatus;
  type: TransactionType;
  categoryKind: CategoryKind;
  paymentMethod: PaymentMethod;
  observation?: string;
}

export interface Reminder {
  id: string;
  text: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  completed: boolean;
  createdAt: string;
}

export interface Birthday {
  id: string;
  name: string;
  date: string; // Formato YYYY-MM-DD
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
}
