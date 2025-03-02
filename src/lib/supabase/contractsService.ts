
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { ContractService } from "@/lib/types";
import { Json } from "@/integrations/supabase/types";

export interface Contract {
  id: string;
  client_name: string;
  client_id?: string;
  contract_number?: string;
  total_amount: number;
  services: ContractService[];
  status: 'pending-signature' | 'active' | 'signed' | 'expired' | 'canceled';
  start_date: string;
  end_date?: string;
  payment_method?: string;
  payment_status?: string;
  installments?: number;
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
    
    const { error } = await supabase
      .from('contracts')
      .insert({
        id,
        client_name: contractData.client_name,
        client_id: contractData.client_id,
        contract_number: contractData.contract_number,
        total_amount: contractData.total_amount,
        services: contractData.services as unknown as Json,
        status: contractData.status,
        start_date: contractData.start_date,
        end_date: contractData.end_date,
        payment_method: contractData.payment_method,
        payment_status: contractData.payment_status,
        installments: contractData.installments,
        due_date: contractData.due_date,
        notes: contractData.notes,
        terms: contractData.terms,
        source_id: contractData.source_id,
        source_type: contractData.source_type,
        user_id: user.id
      });

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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return [];
    }

    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching contracts:", error);
      throw error;
    }

    // Convert services from JSON to array of ContractService
    return data.map(contract => ({
      ...contract,
      services: contract.services as unknown as ContractService[]
    })) as Contract[];
  } catch (error) {
    console.error("Error in getContracts:", error);
    return [];
  }
};

// Get contract by ID
export const getContractById = async (id: string): Promise<Contract | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return null;
    }

    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error("Error fetching contract:", error);
      throw error;
    }

    // Convert services from JSON to array of ContractService
    return {
      ...data,
      services: data.services as unknown as ContractService[]
    } as Contract;
  } catch (error) {
    console.error("Error in getContractById:", error);
    return null;
  }
};

// Update a contract
export const updateContract = async (contract: Partial<Contract> & { id: string }): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return false;
    }

    // Prepare data for update
    const updateData: any = { ...contract };
    if (contract.services) {
      updateData.services = contract.services as unknown as Json;
    }

    const { error } = await supabase
      .from('contracts')
      .update(updateData)
      .eq('id', contract.id)
      .eq('user_id', user.id);

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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return false;
    }

    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

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

// rest of file...
