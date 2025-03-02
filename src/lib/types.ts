
// Common types
export interface SourceEntity {
  id?: string;
  name?: string;
  leadId?: string;
  contactId?: string;
  type?: 'lead' | 'contact';
  [key: string]: any;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  description?: string;
}

export interface ContractService {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface PackageProduct {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  description?: string;
}

export interface FinancialTransaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'pending' | 'completed' | 'canceled';
  dueDate: string;
  client: string;
  paymentMethod?: string;
  category?: string;
  sourceType?: string;
  sourceId?: string;
  totalInstallments?: number;
}

// Re-export common interfaces used with Supabase
export { type Lead } from '@/lib/supabase/types';
export { type Contract } from '@/lib/supabase/contractsService';
export { type Order } from '@/lib/supabase/ordersService';
