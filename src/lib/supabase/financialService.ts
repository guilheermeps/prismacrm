
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Json } from "@/integrations/supabase/types";

// Financial transaction types
export interface FinancialTransaction {
  id: string;
  client: string;
  amount: number;
  due_date: string;
  type: 'receivable' | 'payable';
  status: 'pending' | 'completed';
  payment_method?: string;
  category?: string;
  source_id?: string;
  source_type?: 'order' | 'contract' | 'manual';
  total_installments?: number;
  created_at?: string;
}

// Create a new financial transaction
export const createFinancialTransaction = async (
  transactionData: Omit<FinancialTransaction, 'id' | 'created_at'>
): Promise<string | null> => {
  try {
    const id = uuidv4();
    
    const { error } = await supabase
      .from('financial_transactions')
      .insert({
        id,
        ...transactionData
      });

    if (error) {
      console.error("Error creating financial transaction:", error);
      throw error;
    }

    return id;
  } catch (error) {
    console.error("Error in createFinancialTransaction:", error);
    return null;
  }
};

// Get all financial transactions
export const getFinancialTransactions = async (): Promise<FinancialTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) {
      console.error("Error fetching financial transactions:", error);
      throw error;
    }

    return data as FinancialTransaction[];
  } catch (error) {
    console.error("Error in getFinancialTransactions:", error);
    return [];
  }
};

// Get transaction by ID
export const getTransactionById = async (id: string): Promise<FinancialTransaction | null> => {
  try {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching transaction:", error);
      throw error;
    }

    return data as FinancialTransaction;
  } catch (error) {
    console.error("Error in getTransactionById:", error);
    return null;
  }
};

// Update a transaction
export const updateTransaction = async (
  transaction: Partial<FinancialTransaction> & { id: string }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('financial_transactions')
      .update(transaction)
      .eq('id', transaction.id);

    if (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in updateTransaction:", error);
    return false;
  }
};

// Delete a transaction
export const deleteTransaction = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteTransaction:", error);
    return false;
  }
};

// Get transactions by filter
export const getTransactionsByFilter = async (
  filter: {
    type?: 'receivable' | 'payable';
    status?: 'pending' | 'completed';
    client?: string;
    dateFrom?: string;
    dateTo?: string;
  }
): Promise<FinancialTransaction[]> => {
  try {
    let query = supabase
      .from('financial_transactions')
      .select('*');

    if (filter.type) {
      query = query.eq('type', filter.type);
    }

    if (filter.status) {
      query = query.eq('status', filter.status);
    }

    if (filter.client) {
      query = query.ilike('client', `%${filter.client}%`);
    }

    if (filter.dateFrom) {
      query = query.gte('due_date', filter.dateFrom);
    }

    if (filter.dateTo) {
      query = query.lte('due_date', filter.dateTo);
    }

    const { data, error } = await query.order('due_date', { ascending: true });

    if (error) {
      console.error("Error fetching filtered transactions:", error);
      throw error;
    }

    return data as FinancialTransaction[];
  } catch (error) {
    console.error("Error in getTransactionsByFilter:", error);
    return [];
  }
};
