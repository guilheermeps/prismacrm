
import { supabase } from './client';
import { Lead } from './types';
import { mockLeads } from './mockData';

export const getLeads = async (): Promise<Lead[]> => {
  try {
    // Tenta buscar do Supabase
    const { data, error } = await supabase.from('leads').select('*');
    
    if (error) {
      console.warn('Usando dados simulados para leads:', error.message);
      // Retorna dados mockados caso haja erro
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
    console.warn('Usando dados simulados para leads devido a erro:', e);
    return mockLeads();
  }
};

export const createLead = async (lead: Omit<Lead, 'id'>): Promise<Lead | null> => {
  // Ensure the lead has all required fields
  const leadWithDefaults = {
    ...lead,
    history: lead.history || [],
    isArchived: lead.isArchived === undefined ? false : lead.isArchived
  };
  
  const { data, error } = await supabase
    .from('leads')
    .insert(leadWithDefaults)
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao criar lead:', error);
    
    // In demo/development mode, simulate success with mock data
    if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
      const mockId = Math.random().toString(36).substring(2, 15);
      const mockLead = {
        id: mockId,
        ...leadWithDefaults,
      };
      console.log('Created mock lead in development mode:', mockLead);
      return mockLead;
    }
    
    return null;
  }
  
  return data;
};

export const updateLead = async (lead: Lead): Promise<Lead | null> => {
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
    console.error('Erro ao atualizar lead:', error);
    
    // In demo/development mode, simulate success with mock data
    if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
      console.log('Updated mock lead in development mode:', leadWithDefaults);
      return leadWithDefaults;
    }
    
    return null;
  }
  
  return data;
};

export const deleteLead = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Erro ao excluir lead:', error);
    
    // In demo/development mode, simulate success
    if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
      console.log('Deleted mock lead in development mode, id:', id);
      return true;
    }
    
    return false;
  }
  
  return true;
};
