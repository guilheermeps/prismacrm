
import { Lead } from '../types';

// Function to normalize lead data from Supabase to our application model
export const normalizeLeadFromSupabase = (data: any): Lead => {
  return {
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
};

// Function to normalize lead data from our application model to Supabase
export const normalizeLeadForSupabase = (lead: Omit<Lead, 'id'> | Lead): Record<string, any> => {
  return {
    name: lead.name,
    servicetype: lead.serviceType,
    whatsapp: lead.whatsapp || '',
    stageid: lead.stageId,
    proposalvalue: lead.proposalValue || 0,
    notes: lead.notes || '',
    history: lead.history || [],
    isarchived: lead.isArchived === undefined ? false : lead.isArchived
  };
};
