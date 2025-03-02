
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export interface FinancialTransaction {
  id: string;
  type: 'receivable' | 'payable';
  client: string;
  dueDate: string;
  paymentMethod?: string;
  sourceId?: string;
  sourceType?: 'order' | 'contract' | 'manual';
  status: 'pending' | 'completed' | 'canceled';
  amount: number;
  category?: string;
  totalInstallments?: number;
}

// Create a new financial transaction
export const createTransaction = async (transactionData: Omit<FinancialTransaction, 'id'>): Promise<string | null> => {
  try {
    const id = uuidv4();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return null;
    }
    
    const { error } = await supabase
      .from('financial_transactions')
      .insert({
        id,
        type: transactionData.type,
        client: transactionData.client,
        due_date: transactionData.dueDate,
        payment_method: transactionData.paymentMethod,
        source_id: transactionData.sourceId,
        source_type: transactionData.sourceType,
        status: transactionData.status,
        amount: transactionData.amount,
        category: transactionData.category,
        total_installments: transactionData.totalInstallments,
        user_id: user.id
      });

    if (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }

    return id;
  } catch (error) {
    console.error("Error in createTransaction:", error);
    return null;
  }
};

// Get all financial transactions
export const getTransactions = async (): Promise<FinancialTransaction[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return [];
    }

    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true });

    if (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      type: item.type as 'receivable' | 'payable',
      client: item.client,
      dueDate: item.due_date,
      paymentMethod: item.payment_method,
      sourceId: item.source_id,
      sourceType: item.source_type as 'order' | 'contract' | 'manual' | undefined,
      status: item.status as 'pending' | 'completed' | 'canceled',
      amount: item.amount,
      category: item.category,
      totalInstallments: item.total_installments
    }));
  } catch (error) {
    console.error("Error in getTransactions:", error);
    return [];
  }
};

// Get transaction by ID
export const getTransactionById = async (id: string): Promise<FinancialTransaction | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return null;
    }

    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error("Error fetching transaction:", error);
      throw error;
    }

    return {
      id: data.id,
      type: data.type as 'receivable' | 'payable',
      client: data.client,
      dueDate: data.due_date,
      paymentMethod: data.payment_method,
      sourceId: data.source_id,
      sourceType: data.source_type as 'order' | 'contract' | 'manual' | undefined,
      status: data.status as 'pending' | 'completed' | 'canceled',
      amount: data.amount,
      category: data.category,
      totalInstallments: data.total_installments
    };
  } catch (error) {
    console.error("Error in getTransactionById:", error);
    return null;
  }
};

// Update a transaction
export const updateTransaction = async (transaction: Partial<FinancialTransaction> & { id: string }): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return false;
    }
    
    const updateData = {
      type: transaction.type,
      client: transaction.client,
      due_date: transaction.dueDate,
      payment_method: transaction.paymentMethod,
      source_id: transaction.sourceId,
      source_type: transaction.sourceType,
      status: transaction.status,
      amount: transaction.amount,
      category: transaction.category,
      total_installments: transaction.totalInstallments
    };

    const { error } = await supabase
      .from('financial_transactions')
      .update(updateData)
      .eq('id', transaction.id)
      .eq('user_id', user.id);

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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return false;
    }

    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

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
