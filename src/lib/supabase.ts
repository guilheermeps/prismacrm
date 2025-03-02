import { createClient } from '@supabase/supabase-js';

// Inicialização do cliente Supabase com fallback para valores mocados
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-supabase-url.com';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key';

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

// Modificando as funções para retornar dados simulados quando não há conexão com Supabase
export const getLeads = async (): Promise<Lead[]> => {
  try {
    // Tenta buscar do Supabase
    const { data, error } = await supabase.from('leads').select('*');
    
    if (error) {
      console.warn('Usando dados simulados para leads:', error.message);
      // Retorna dados mockados caso haja erro
      return mockLeads();
    }
    
    return data || [];
  } catch (e) {
    console.warn('Usando dados simulados para leads devido a erro:', e);
    return mockLeads();
  }
};

export const getStages = async (): Promise<Stage[]> => {
  try {
    const { data, error } = await supabase.from('stages').select('*');
    
    if (error) {
      console.warn('Usando dados simulados para estágios:', error.message);
      return mockStages();
    }
    
    return data || [];
  } catch (e) {
    console.warn('Usando dados simulados para estágios devido a erro:', e);
    return mockStages();
  }
};

// Funções para criar dados mockados
const mockLeads = (): Lead[] => {
  return [
    {
      id: '1',
      name: 'João Silva',
      serviceType: 'Casamento',
      whatsapp: '11987654321',
      stageId: 'stage1',
      proposalValue: 3500,
      notes: 'Cliente interessado em pacote completo',
      createdAt: new Date().toISOString(),
      history: [
        {
          action: 'created',
          timestamp: new Date().toISOString(),
          from: null,
          to: 'Contato Inicial'
        }
      ]
    },
    {
      id: '2',
      name: 'Maria Oliveira',
      serviceType: 'Ensaio',
      whatsapp: '11912345678',
      stageId: 'stage2',
      proposalValue: 1200,
      notes: 'Ensaio pré-wedding',
      createdAt: new Date().toISOString(),
      history: [
        {
          action: 'moved',
          timestamp: new Date().toISOString(),
          from: 'Contato Inicial',
          to: 'Proposta Enviada'
        }
      ]
    }
  ];
};

const mockStages = (): Stage[] => {
  return [
    {
      id: 'stage1',
      title: 'Contato Inicial',
      color: '#3498db'
    },
    {
      id: 'stage2',
      title: 'Proposta Enviada',
      color: '#f39c12'
    },
    {
      id: 'stage3',
      title: 'Negociação',
      color: '#9b59b6'
    },
    {
      id: 'stage4',
      title: 'Fechado',
      color: '#2ecc71'
    }
  ];
};

// Funções para interagir com o Supabase
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
