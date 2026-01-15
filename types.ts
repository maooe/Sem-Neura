
export enum TransactionType {
  PAYABLE = 'PAGAR',
  RECEIVABLE = 'RECEBER'
}

export type CategoryKind = 'FIXED' | 'VARIABLE' | 'RECURRING';

export type ExtendedStatus = 'PAID' | 'OPEN' | 'SCHEDULED' | 'OVERDUE' | 'CANCELLED' | 'OTHER';

export type PaymentMethod = 'PIX' | 'CASH' | 'CARD' | 'OTHER';

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

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
}
