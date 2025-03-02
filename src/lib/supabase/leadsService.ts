
import { supabase } from './client';
import { Lead } from './types';
import { mockLeads } from './mockData';

// Function to get all leads
export const getLeads = async (): Promise<Lead[]> => {
  try {
    console.log('Fetching leads from Supabase...');
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
    const processedData = data.map(lead => ({
      id: lead.id,
      name: lead.name,
      serviceType: lead.servicetype,
      whatsapp: lead.whatsapp || '',
      stageId: lead.stageid,
      proposalValue: lead.proposalvalue || 0,
      notes: lead.notes || '',
      createdAt: lead.createdat,
      isArchived: lead.isarchived === undefined ? false : lead.isarchived,
      history: lead.history || []
    }));
    
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
    
    // Ensure the lead has all required fields and normalize field names for DB
    const leadWithDefaults = {
      name: lead.name,
      servicetype: lead.serviceType,
      whatsapp: lead.whatsapp || '',
      stageid: lead.stageId,
      proposalvalue: lead.proposalValue || 0,
      notes: lead.notes || '',
      history: lead.history || [],
      isarchived: lead.isArchived === undefined ? false : lead.isArchived,
      createdat: new Date().toISOString()
    };
    
    console.log('Sending to Supabase:', leadWithDefaults);
    
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
          name: lead.name,
          serviceType: lead.serviceType,
          whatsapp: lead.whatsapp || '',
          stageId: lead.stageId,
          proposalValue: lead.proposalValue || 0,
          notes: lead.notes || '',
          createdAt: new Date().toISOString(),
          isArchived: lead.isArchived === undefined ? false : lead.isArchived,
          history: lead.history || []
        };
        console.log('Created mock lead in development mode:', mockLead);
        return mockLead;
      }
      
      return null;
    }
    
    console.log('Successfully created lead:', data);
    
    // Normalize field names
    const normalizedLead: Lead = {
      id: data.id,
      name: data.name,
      serviceType: data.servicetype,
      whatsapp: data.whatsapp || '',
      stageId: data.stageid,
      proposalValue: data.proposalvalue || 0,
      notes: data.notes || '',
      createdAt: data.createdat,
      isArchived: data.isarchived === undefined ? false : data.isarchived,
      history: data.history || []
    };
    
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
    
    // Normalize field names for DB
    const leadWithDefaults = {
      name: lead.name,
      servicetype: lead.serviceType,
      whatsapp: lead.whatsapp || '',
      stageid: lead.stageId,
      proposalvalue: lead.proposalValue || 0,
      notes: lead.notes || '',
      history: lead.history || [],
      isarchived: lead.isArchived === undefined ? false : lead.isArchived
    };
    
    console.log('Sending to Supabase:', leadWithDefaults);
    
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
        console.log('Updated mock lead in development mode:', lead);
        return lead;
      }
      
      return null;
    }
    
    console.log('Successfully updated lead:', data);
    
    // Normalize field names
    const normalizedLead: Lead = {
      id: data.id,
      name: data.name,
      serviceType: data.servicetype,
      whatsapp: data.whatsapp || '',
      stageId: data.stageid,
      proposalValue: data.proposalvalue || 0,
      notes: data.notes || '',
      createdAt: data.createdat,
      isArchived: data.isarchived === undefined ? false : data.isarchived,
      history: data.history || []
    };
    
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
  if (!number) return '';
  
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
  if (!number) return '';
  
  const formattedNumber = formatWhatsAppNumber(number);
  return `https://api.whatsapp.com/send?phone=${formattedNumber}`;
};
