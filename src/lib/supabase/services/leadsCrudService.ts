
import { supabase } from '../client';
import { Lead } from '../types';
import { mockLeads } from '../mockData';
import { normalizeLeadFromSupabase, normalizeLeadForSupabase } from '../utils/leadNormalizer';

// Function to get all leads
export const getLeads = async (): Promise<Lead[]> => {
  try {
    console.log('Fetching leads from Supabase...');
    
    // Check if we're in development or demo mode - return mock data directly
    if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
      console.log('Development or demo mode detected, returning mock leads');
      return mockLeads();
    }
    
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('createdat', { ascending: false });
    
    if (error) {
      console.error('Error fetching leads:', error.message);
      // Return mock data if there's an error
      return mockLeads();
    }
    
    if (!data || data.length === 0) {
      console.log('No leads found, returning mock data for demonstration');
      return mockLeads();
    }
    
    console.log('Fetched leads:', data);
    
    // Ensure all leads have the required fields and normalize field names
    const processedData = data.map(lead => normalizeLeadFromSupabase(lead));
    
    return processedData;
  } catch (e) {
    console.error('Exception while fetching leads:', e);
    return mockLeads();
  }
};

// Function to create a new lead
export const createLead = async (lead: Omit<Lead, 'id'>): Promise<Lead | null> => {
  try {
    console.log('Creating lead with data:', lead);
    
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      console.error('No user ID found, cannot create lead');
      return null;
    }
    
    // Check if we're in development or demo mode - simulate success with mock data
    if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
      const mockId = crypto.randomUUID();
      const mockLead = {
        id: mockId,
        name: lead.name,
        serviceType: lead.serviceType,
        whatsapp: lead.whatsapp || '',
        stageId: lead.stageId,
        proposalValue: lead.proposalValue || 0,
        notes: lead.notes || '',
        createdAt: new Date().toISOString(),
        isArchived: lead.isArchived === undefined ? false : lead.isArchived,
        history: lead.history || [],
        user_id: userId
      };
      console.log('Created mock lead in development mode:', mockLead);
      return mockLead;
    }
    
    // Normalize lead data for Supabase
    const leadWithDefaults = {
      ...normalizeLeadForSupabase(lead),
      createdat: new Date().toISOString(),
      user_id: userId
    };
    
    console.log('Sending to Supabase:', leadWithDefaults);
    
    const { data, error } = await supabase
      .from('leads')
      .insert(leadWithDefaults)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating lead in Supabase:', error);
      return null;
    }
    
    console.log('Successfully created lead:', data);
    
    // Normalize field names
    const normalizedLead = normalizeLeadFromSupabase(data);
    
    return normalizedLead;
  } catch (error) {
    console.error('Exception while creating lead:', error);
    return null;
  }
};

// Function to update an existing lead
export const updateLead = async (lead: Lead): Promise<Lead | null> => {
  try {
    console.log('Updating lead:', lead);
    
    // Check if we're in development or demo mode - simulate success with mock data
    if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
      console.log('Updated mock lead in development mode:', lead);
      return lead;
    }
    
    // Normalize field names for DB
    const leadWithDefaults = normalizeLeadForSupabase(lead);
    
    console.log('Sending to Supabase:', leadWithDefaults);
    
    const { data, error } = await supabase
      .from('leads')
      .update(leadWithDefaults)
      .eq('id', lead.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating lead in Supabase:', error);
      return null;
    }
    
    console.log('Successfully updated lead:', data);
    
    // Normalize field names
    const normalizedLead = normalizeLeadFromSupabase(data);
    
    return normalizedLead;
  } catch (error) {
    console.error('Exception while updating lead:', error);
    return null;
  }
};

// Function to delete a lead
export const deleteLead = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting lead with ID:', id);
    
    // Check if we're in development or demo mode - simulate success
    if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
      console.log('Deleted mock lead in development mode, id:', id);
      return true;
    }
    
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting lead from Supabase:', error);
      return false;
    }
    
    console.log('Successfully deleted lead with ID:', id);
    return true;
  } catch (error) {
    console.error('Exception while deleting lead:', error);
    return false;
  }
};
