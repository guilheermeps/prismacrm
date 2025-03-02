
import { Lead } from '../types';

// Function to normalize lead data from Supabase to our application model
export const normalizeLeadFromSupabase = (data: any): Lead => {
  console.log("Normalizing lead from Supabase:", data);
  
  return {
    id: data.id || '',
    name: data.name || '',
    serviceType: data.servicetype || '', // Map from DB field to our interface
    whatsapp: data.whatsapp || '',
    stageId: data.stageid || '',
    proposalValue: data.proposalvalue || 0,
    notes: data.notes || '',
    createdAt: data.createdat || new Date().toISOString(), // Map from DB field to our interface
    isArchived: data.isarchived === true ? true : false,
    history: data.history || []
  };
};

// Function to normalize lead data from our application model to Supabase
export const normalizeLeadForSupabase = (lead: Omit<Lead, 'id'> | Lead): Record<string, any> => {
  console.log("Normalizing lead for Supabase insertion:", lead);
  
  // Ensure all fields are properly mapped to the database column names
  return {
    name: lead.name || '',
    servicetype: lead.serviceType || '', // Map from our interface to DB field
    whatsapp: lead.whatsapp || '',
    stageid: lead.stageId || '',
    proposalvalue: typeof lead.proposalValue === 'number' ? lead.proposalValue : 0,
    notes: lead.notes || '',
    history: Array.isArray(lead.history) ? lead.history : [],
    isarchived: lead.isArchived === true ? true : false,
    createdat: lead.createdAt || new Date().toISOString() // Always ensure createdat is present
  };
};
