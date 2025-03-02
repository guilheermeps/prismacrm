
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Lead {
  id: string;
  name: string;
  serviceType: string;
  whatsapp: string;
  stageId: string;
  proposalValue: number;
  notes?: string;
  createdAt: string;
  history: LeadHistory[];
}

export interface LeadHistory {
  action: string;
  timestamp: string;
  from: string | null;
  to: string;
}

export interface Stage {
  id: string;
  title: string;
  color: string;
}

// Funções para interagir com o Supabase
export const getLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase.from('leads').select('*');
  
  if (error) {
    console.error('Erro ao buscar leads:', error);
    return [];
  }
  
  return data || [];
};

export const getStages = async (): Promise<Stage[]> => {
  const { data, error } = await supabase.from('stages').select('*');
  
  if (error) {
    console.error('Erro ao buscar estágios:', error);
    return [];
  }
  
  return data || [];
};

export const createLead = async (lead: Omit<Lead, 'id'>): Promise<Lead | null> => {
  const { data, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao criar lead:', error);
    return null;
  }
  
  return data;
};

export const updateLead = async (lead: Lead): Promise<Lead | null> => {
  const { data, error } = await supabase
    .from('leads')
    .update(lead)
    .eq('id', lead.id)
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao atualizar lead:', error);
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
    return false;
  }
  
  return true;
};

export const createStage = async (stage: Omit<Stage, 'id'>): Promise<Stage | null> => {
  const { data, error } = await supabase
    .from('stages')
    .insert(stage)
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao criar estágio:', error);
    return null;
  }
  
  return data;
};

export const updateStage = async (stage: Stage): Promise<Stage | null> => {
  const { data, error } = await supabase
    .from('stages')
    .update(stage)
    .eq('id', stage.id)
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao atualizar estágio:', error);
    return null;
  }
  
  return data;
};

export const deleteStage = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('stages')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Erro ao excluir estágio:', error);
    return false;
  }
  
  return true;
};
