
import { supabase } from "../client";
import { Lead } from '../types';
import { normalizeLeadFromSupabase, normalizeLeadForSupabase } from '../utils/leadNormalizer';

// Get all leads for the current user
export async function getLeads() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("No session, using mock data for leads");
      return []; // Return empty array when not logged in
    }
    
    const userId = session.user.id;
    
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .eq('isarchived', false)
      .order('createdat', { ascending: false });
      
    if (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
    
    // Normalize the data from Supabase to our application model
    return data.map(normalizeLeadFromSupabase);
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
      console.log("No session, returning empty archived leads");
      return [];
    }
    
    const userId = session.user.id;
    
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .eq('isarchived', true)
      .order('createdat', { ascending: false });
      
    if (error) {
      console.error('Error fetching archived leads:', error);
      return [];
    }
    
    return data.map(normalizeLeadFromSupabase);
  } catch (error) {
    console.error('Error in getArchivedLeads:', error);
    return [];
  }
}

// Create a new lead
export async function createLead(lead: Omit<Lead, 'id'>) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("No session found");

    const userId = session.user.id;
    const normalizedLead = normalizeLeadForSupabase(lead);

    const { data, error } = await supabase
      .from('leads')
      .insert([{ ...normalizedLead, user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      throw error;
    }

    return normalizeLeadFromSupabase(data);
  } catch (error) {
    console.error('Error in createLead:', error);
    throw error;
  }
}

// Update an existing lead
export async function updateLead(lead: Lead) {
  try {
    const normalizedUpdates = normalizeLeadForSupabase(lead);

    const { data, error } = await supabase
      .from('leads')
      .update(normalizedUpdates)
      .eq('id', lead.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating lead:', error);
      throw error;
    }

    return normalizeLeadFromSupabase(data);
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

// Search leads by name or service type
export async function searchLeads(query: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];
    
    const userId = session.user.id;
    
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .or(`name.ilike.%${query}%,servicetype.ilike.%${query}%`)
      .eq('isarchived', false)
      .order('createdat', { ascending: false });
      
    if (error) {
      console.error('Error searching leads:', error);
      return [];
    }
    
    return data.map(normalizeLeadFromSupabase);
  } catch (error) {
    console.error('Error in searchLeads:', error);
    return [];
  }
}
