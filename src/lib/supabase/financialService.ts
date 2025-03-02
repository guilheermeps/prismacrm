
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Financial transaction types
export interface FinancialTransaction {
  id: string;
  client: string;
  amount: number;
  due_date: string;
  category?: string;
  payment_method?: string;
  total_installments?: number;
  type: 'receivable' | 'payable';
  status: 'pending' | 'completed';
  source_id?: string;
  source_type?: 'order' | 'contract' | 'manual';
  created_at: string;
}

// Create a new financial transaction
export const createFinancialTransaction = async (transactionData: Omit<FinancialTransaction, 'id' | 'created_at'>): Promise<string | null> => {
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

// Get financial transaction by ID
export const getFinancialTransactionById = async (id: string): Promise<FinancialTransaction | null> => {
  try {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching financial transaction:", error);
      throw error;
    }

    return data as FinancialTransaction;
  } catch (error) {
    console.error("Error in getFinancialTransactionById:", error);
    return null;
  }
};

// Update a financial transaction
export const updateFinancialTransaction = async (transaction: Partial<FinancialTransaction> & { id: string }): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('financial_transactions')
      .update(transaction)
      .eq('id', transaction.id);

    if (error) {
      console.error("Error updating financial transaction:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in updateFinancialTransaction:", error);
    return false;
  }
};

// Delete a financial transaction
export const deleteFinancialTransaction = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting financial transaction:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteFinancialTransaction:", error);
    return false;
  }
};

// Get financial transactions by filter
export const getFinancialTransactionsByFilter = async (
  filter: {
    type?: 'receivable' | 'payable';
    status?: 'pending' | 'completed';
    client?: string;
    dateFrom?: string;
    dateTo?: string;
    category?: string;
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

    if (filter.category) {
      query = query.eq('category', filter.category);
    }

    if (filter.dateFrom) {
      query = query.gte('due_date', filter.dateFrom);
    }

    if (filter.dateTo) {
      query = query.lte('due_date', filter.dateTo);
    }

    const { data, error } = await query.order('due_date', { ascending: true });

    if (error) {
      console.error("Error fetching filtered financial transactions:", error);
      throw error;
    }

    return data as FinancialTransaction[];
  } catch (error) {
    console.error("Error in getFinancialTransactionsByFilter:", error);
    return [];
  }
};

// Get financial transactions by source
export const getFinancialTransactionsBySource = async (sourceId: string, sourceType: 'order' | 'contract' | 'manual'): Promise<FinancialTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('source_id', sourceId)
      .eq('source_type', sourceType)
      .order('due_date', { ascending: true });

    if (error) {
      console.error("Error fetching financial transactions by source:", error);
      throw error;
    }

    return data as FinancialTransaction[];
  } catch (error) {
    console.error("Error in getFinancialTransactionsBySource:", error);
    return [];
  }
};
