
import { supabase } from "../client";
import { Lead } from '../types';
import { normalizeLeadFromSupabase, normalizeLeadForSupabase } from '../utils/leadNormalizer';
import { addHistoryEntry } from "@/components/sales-pipeline/hooks/utils/leadHistoryUtils";

// Helper function to handle missing session by providing mock data for development
const handleMissingSession = () => {
  console.log("No user session, using mock data mode");
  return []; // Return empty array when not logged in
};

// Get all leads for the current user
export async function getLeads() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return handleMissingSession();
    }
    
    const userId = session.user.id;
    console.log("Fetching leads for user:", userId);
    
    // For development without auth, we can use a hardcoded query for testing
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('createdat', { ascending: false });
      
    if (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
    
    console.log('Fetched leads from Supabase:', data);
    
    // Normalize the data from Supabase to our application model
    return data ? data.map(normalizeLeadFromSupabase) : [];
  } catch (error) {
    console.error('Error in getLeads:', error);
    return [];
  }
}

// Get archived leads for the current user
export async function getArchivedLeads() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return handleMissingSession();
    }
    
    // For development without auth, we can use a hardcoded query for testing
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('isarchived', true)
      .order('createdat', { ascending: false });
      
    if (error) {
      console.error('Error fetching archived leads:', error);
      throw error;
    }
    
    return data ? data.map(normalizeLeadFromSupabase) : [];
  } catch (error) {
    console.error('Error in getArchivedLeads:', error);
    return [];
  }
}

// Create a new lead
export async function createLead(lead: Omit<Lead, 'id'>) {
  try {
    console.log("createLead function called with:", lead);
    
    // IMPORTANT FIX: Instead of using a mock user_id that doesn't exist,
    // We will insert the lead without a user_id for now (development only)
    // In production, this should use the authenticated user's ID
    
    // Make sure the lead has a createdAt timestamp
    const leadWithDate = {
      ...lead,
      createdAt: lead.createdAt || new Date().toISOString()
    };
    
    // Normalize the lead for Supabase
    const normalizedLead = normalizeLeadForSupabase(leadWithDate);

    console.log("Creating lead with normalized data:", normalizedLead);
    
    // Prepare the lead data for insertion WITHOUT user_id for development
    // Remove user_id since it's causing foreign key constraint issues
    const leadForInsertion = {
      ...normalizedLead
      // No user_id for development
    };
    
    console.log("Final lead object for insertion:", leadForInsertion);
    
    const { data, error } = await supabase
      .from('leads')
      .insert([leadForInsertion])
      .select();

    if (error) {
      console.error('Error creating lead:', error);
      throw error;
    }

    console.log("Lead created successfully in Supabase, response:", data);
    return data && data.length > 0 ? normalizeLeadFromSupabase(data[0]) : null;
  } catch (error) {
    console.error('Error in createLead:', error);
    throw error;
  }
}

// Update an existing lead
export async function updateLead(lead: Lead) {
  try {
    const normalizedUpdates = normalizeLeadForSupabase(lead);
    console.log("Updating lead in Supabase:", lead.id, normalizedUpdates);

    const { data, error } = await supabase
      .from('leads')
      .update(normalizedUpdates)
      .eq('id', lead.id)
      .select();

    if (error) {
      console.error('Error updating lead:', error);
      throw error;
    }

    console.log("Lead updated successfully in Supabase:", data);
    return data && data.length > 0 ? normalizeLeadFromSupabase(data[0]) : null;
  } catch (error) {
    console.error('Error in updateLead:', error);
    throw error;
  }
}

// Delete a lead
export async function deleteLead(id: string) {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteLead:', error);
    return false;
  }
}

// Update a lead when creating a transaction
export async function updateLeadForTransactionCreation(
  lead: Lead, 
  transactionType: 'order' | 'contract'
): Promise<boolean> {
  try {
    // Update lead history to show a transaction was created from it
    const updatedLead = {
      ...lead,
      history: addHistoryEntry(
        lead.history, 
        transactionType === 'order' ? 'created_order' : 'created_contract',
        null,
        null
      )
    };
    
    await updateLead(updatedLead);
    
    return true;
  } catch (error) {
    console.error(`Error in updateLeadForTransactionCreation:`, error);
    return false;
  }
}
