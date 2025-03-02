
import { Lead } from '../types';

// Function to normalize lead data from Supabase to our application model
export const normalizeLeadFromSupabase = (data: any): Lead => {
  return {
    id: data.id,
    name: data.name,
    serviceType: data.servicetype, // Map from DB field to our interface
    whatsapp: data.whatsapp || '',
    stageId: data.stageid,
    proposalValue: data.proposalvalue || 0,
    notes: data.notes || '',
    createdAt: data.createdat, // Map from DB field to our interface
    isArchived: data.isarchived === undefined ? false : data.isarchived,
    history: data.history || []
  };
};

// Function to normalize lead data from our application model to Supabase
export const normalizeLeadForSupabase = (lead: Omit<Lead, 'id'> | Lead): Record<string, any> => {
  return {
    name: lead.name,
    servicetype: lead.serviceType, // Map from our interface to DB field
    whatsapp: lead.whatsapp || '',
    stageid: lead.stageId,
    proposalvalue: lead.proposalValue || 0,
    notes: lead.notes || '',
    history: lead.history || [],
    isarchived: lead.isArchived === undefined ? false : lead.isArchived
  };
};
