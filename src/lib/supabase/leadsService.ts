
import { supabase } from './client';
import { Lead } from './types';
import { mockLeads } from './mockData';

export const getLeads = async (): Promise<Lead[]> => {
  try {
    // Try to fetch from Supabase
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching leads:', error.message);
      // Return mock data if there's an error
      return mockLeads();
    }
    
    if (!data || data.length === 0) {
      console.log('No leads found, returning mock data for demonstration');
      return mockLeads();
    }
    
    // Ensure all leads have the required fields
    const processedData = data.map(lead => ({
      ...lead,
      history: lead.history || [],
      isArchived: lead.isArchived === undefined ? false : lead.isArchived
    }));
    
    return processedData;
  } catch (e) {
    console.error('Exception while fetching leads:', e);
    return mockLeads();
  }
};

export const createLead = async (lead: Omit<Lead, 'id'>): Promise<Lead | null> => {
  try {
    console.log('Creating lead with data:', lead);
    
    // Ensure the lead has all required fields
    const leadWithDefaults = {
      ...lead,
      history: lead.history || [],
      isArchived: lead.isArchived === undefined ? false : lead.isArchived,
      createdAt: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('leads')
      .insert(leadWithDefaults)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating lead in Supabase:', error);
      
      // In demo/development mode, simulate success with mock data
      if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
        const mockId = crypto.randomUUID();
        const mockLead = {
          id: mockId,
          ...leadWithDefaults,
        };
        console.log('Created mock lead in development mode:', mockLead);
        return mockLead;
      }
      
      return null;
    }
    
    console.log('Successfully created lead:', data);
    return data;
  } catch (error) {
    console.error('Exception while creating lead:', error);
    return null;
  }
};

export const updateLead = async (lead: Lead): Promise<Lead | null> => {
  try {
    console.log('Updating lead:', lead);
    
    // Ensure the lead has all required fields
    const leadWithDefaults = {
      ...lead,
      history: lead.history || [],
      isArchived: lead.isArchived === undefined ? false : lead.isArchived
    };
    
    const { data, error } = await supabase
      .from('leads')
      .update(leadWithDefaults)
      .eq('id', lead.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating lead in Supabase:', error);
      
      // In demo/development mode, simulate success with mock data
      if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
        console.log('Updated mock lead in development mode:', leadWithDefaults);
        return leadWithDefaults;
      }
      
      return null;
    }
    
    console.log('Successfully updated lead:', data);
    return data;
  } catch (error) {
    console.error('Exception while updating lead:', error);
    return null;
  }
};

export const deleteLead = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting lead with ID:', id);
    
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting lead from Supabase:', error);
      
      // In demo/development mode, simulate success
      if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
        console.log('Deleted mock lead in development mode, id:', id);
        return true;
      }
      
      return false;
    }
    
    console.log('Successfully deleted lead with ID:', id);
    return true;
  } catch (error) {
    console.error('Exception while deleting lead:', error);
    return false;
  }
};

// Function to format WhatsApp number
export const formatWhatsAppNumber = (number: string): string => {
  // Remove any non-digit characters
  const digits = number.replace(/\D/g, '');
  
  // If it doesn't start with country code, add Brazilian code (55)
  if (digits.length <= 11) {
    return `55${digits}`;
  }
  
  return digits;
};

// Function to get WhatsApp URL
export const getWhatsAppUrl = (number: string): string => {
  const formattedNumber = formatWhatsAppNumber(number);
  return `https://api.whatsapp.com/send?phone=${formattedNumber}`;
};
