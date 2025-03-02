
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Json } from "@/integrations/supabase/types";

// Contract types
export interface ContractService {
  id: string;
  name: string;
  description?: string;
  price: number;
}

export interface Contract {
  id: string;
  client_name: string;
  client_id?: string;
  contract_number?: string;
  total_amount: number;
  services: ContractService[];
  status: 'active' | 'pending-signature' | 'signed' | 'canceled' | 'expired';
  payment_method: string;
  payment_status: 'pending' | 'completed';
  installments: number;
  start_date: string;
  end_date?: string;
  due_date?: string;
  notes?: string;
  terms?: string;
  created_at: string;
  source_id?: string;
  source_type?: 'lead' | 'contact' | 'manual';
}

// Create a new contract
export const createContract = async (contractData: Omit<Contract, 'id' | 'created_at'>): Promise<string | null> => {
  try {
    const id = uuidv4();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return null;
    }
    
    // Convert contractData.services to JSON-compatible format
    const dbContract = {
      id,
      client_name: contractData.client_name,
      client_id: contractData.client_id,
      contract_number: contractData.contract_number,
      total_amount: contractData.total_amount,
      services: contractData.services as unknown as Json,
      status: contractData.status,
      payment_method: contractData.payment_method,
      payment_status: contractData.payment_status,
      installments: contractData.installments,
      start_date: contractData.start_date,
      end_date: contractData.end_date,
      due_date: contractData.due_date,
      notes: contractData.notes,
      terms: contractData.terms,
      source_id: contractData.source_id,
      source_type: contractData.source_type,
      user_id: user.id
    };
    
    const { error } = await supabase
      .from('contracts')
      .insert(dbContract);

    if (error) {
      console.error("Error creating contract:", error);
      throw error;
    }

    return id;
  } catch (error) {
    console.error("Error in createContract:", error);
    return null;
  }
};

// Get all contracts
export const getContracts = async (): Promise<Contract[]> => {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching contracts:", error);
      throw error;
    }

    // Convert the data from JSON to our Contract type
    const contracts = data.map(item => ({
      ...item,
      services: item.services as unknown as ContractService[]
    })) as Contract[];

    return contracts;
  } catch (error) {
    console.error("Error in getContracts:", error);
    return [];
  }
};

// Get contract by ID
export const getContractById = async (id: string): Promise<Contract | null> => {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching contract:", error);
      throw error;
    }

    if (!data) return null;

    // Convert the data from JSON to our Contract type
    const contract = {
      ...data,
      services: data.services as unknown as ContractService[]
    } as Contract;

    return contract;
  } catch (error) {
    console.error("Error in getContractById:", error);
    return null;
  }
};

// Update a contract
export const updateContract = async (contract: Partial<Contract> & { id: string }): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return false;
    }
    
    // Prepare DB-compatible object
    const dbContract: any = { ...contract };
    if (contract.services) {
      dbContract.services = contract.services as unknown as Json;
    }

    const { error } = await supabase
      .from('contracts')
      .update(dbContract)
      .eq('id', contract.id);

    if (error) {
      console.error("Error updating contract:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in updateContract:", error);
    return false;
  }
};

// Delete a contract
export const deleteContract = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting contract:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteContract:", error);
    return false;
  }
};

// Get contracts by filter
export const getContractsByFilter = async (
  filter: {
    status?: string;
    client_name?: string;
    dateFrom?: string;
    dateTo?: string;
    paymentStatus?: string;
  }
): Promise<Contract[]> => {
  try {
    let query = supabase
      .from('contracts')
      .select('*');

    if (filter.status && filter.status !== 'all') {
      query = query.eq('status', filter.status);
    }

    if (filter.paymentStatus && filter.paymentStatus !== 'all') {
      query = query.eq('payment_status', filter.paymentStatus);
    }

    if (filter.client_name) {
      query = query.ilike('client_name', `%${filter.client_name}%`);
    }

    if (filter.dateFrom) {
      query = query.gte('created_at', filter.dateFrom);
    }

    if (filter.dateTo) {
      query = query.lte('created_at', filter.dateTo);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching filtered contracts:", error);
      throw error;
    }

    // Convert the data from JSON to our Contract type
    const contracts = data.map(item => ({
      ...item,
      services: item.services as unknown as ContractService[]
    })) as Contract[];

    return contracts;
  } catch (error) {
    console.error("Error in getContractsByFilter:", error);
    return [];
  }
};
