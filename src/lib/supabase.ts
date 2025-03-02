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

export interface ClientRegistrationLink {
  id: string;
  lead_id: string;
  token: string;
  created_at: string;
  expires_at: string;
  is_used: boolean;
  form_data: any;
}

// Cache local para links de registro
const mockClientLinks: Record<string, ClientRegistrationLink> = {};

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

// Novas funções para gerenciar links de registro de clientes
export const generateClientRegistrationLink = async (leadId: string): Promise<ClientRegistrationLink | null> => {
  try {
    // Gerar um token único usando crypto.randomUUID (compatible with modern browsers)
    const token = crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Verificar se estamos trabalhando offline/com mock data
    try {
      // Verificar se já existe um link para este lead
      const { data: existingLink, error: fetchError } = await supabase
        .from('client_registration_links')
        .select('*')
        .eq('lead_id', leadId)
        .maybeSingle();
      
      if (fetchError) {
        throw new Error('Modo offline');
      }
      
      if (existingLink) {
        // Se já existe um link, retorna ele
        console.log("Link existente encontrado:", existingLink);
        return existingLink as ClientRegistrationLink;
      }
      
      // Criar novo link
      const { data, error } = await supabase
        .from('client_registration_links')
        .insert({ 
          lead_id: leadId, 
          token: token,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 dias
        })
        .select()
        .single();
      
      if (error) {
        console.error("Erro ao inserir link:", error);
        throw new Error(error.message);
      }
      
      console.log("Novo link criado:", data);
      return data as ClientRegistrationLink;
    } catch (e) {
      console.warn('Usando dados simulados para links de registro:', e);
      
      // Se já existe um link mockado para este lead, retorna ele
      if (mockClientLinks[leadId]) {
        console.log("Link mockado existente encontrado:", mockClientLinks[leadId]);
        return mockClientLinks[leadId];
      }
      
      // Criar novo link mockado
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setDate(expiresAt.getDate() + 7); // Adiciona 7 dias
      
      const mockLink: ClientRegistrationLink = {
        id: Math.random().toString(36).substring(2, 15),
        lead_id: leadId,
        token: token,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        is_used: false,
        form_data: {}
      };
      
      // Armazenar no cache local
      mockClientLinks[leadId] = mockLink;
      console.log("Novo link mockado criado:", mockLink);
      
      return mockLink;
    }
  } catch (e) {
    console.error('Erro ao gerar link de registro:', e);
    return null;
  }
};

export const getClientRegistrationLink = async (leadId: string): Promise<ClientRegistrationLink | null> => {
  try {
    try {
      const { data, error } = await supabase
        .from('client_registration_links')
        .select('*')
        .eq('lead_id', leadId)
        .maybeSingle();
      
      if (error) {
        console.error("Erro ao buscar link:", error);
        throw new Error('Modo offline');
      }
      
      console.log("Link encontrado no supabase:", data);
      return data as ClientRegistrationLink;
    } catch (e) {
      // Em modo offline, retorna o link do cache se existir
      if (mockClientLinks[leadId]) {
        console.log("Link mockado encontrado:", mockClientLinks[leadId]);
        return mockClientLinks[leadId];
      }
      console.log("Nenhum link encontrado para lead_id:", leadId);
      return null;
    }
  } catch (e) {
    console.error('Erro ao buscar link de registro:', e);
    return null;
  }
};

export const validateClientRegistrationToken = async (token: string): Promise<{valid: boolean, leadId?: string}> => {
  console.log("Validando token:", token);
  
  if (!token) {
    console.log("Token vazio");
    return { valid: false };
  }
  
  try {
    try {
      const { data, error } = await supabase
        .from('client_registration_links')
        .select('*')
        .eq('token', token)
        .maybeSingle();
      
      if (error) {
        console.error("Erro ao validar token no supabase:", error);
        throw new Error('Modo offline ou token inválido');
      }
      
      console.log("Resultado da validação supabase:", data);
      
      if (!data) {
        console.log("Token não encontrado no supabase");
        return { valid: false };
      }
      
      const link = data as ClientRegistrationLink;
      
      // Verificar se o link já foi usado
      if (link.is_used) {
        console.log("Link já utilizado");
        return { valid: false };
      }
      
      // Verificar se o link expirou
      if (new Date(link.expires_at) < new Date()) {
        console.log("Link expirado");
        return { valid: false };
      }
      
      console.log("Link válido no supabase");
      return { 
        valid: true,
        leadId: link.lead_id
      };
    } catch (e) {
      console.log("Verificando token em modo offline:", token);
      // Em modo offline, verificar no cache local
      for (const leadId in mockClientLinks) {
        const link = mockClientLinks[leadId];
        if (link.token === token) {
          console.log("Token encontrado nos mocks:", link);
          
          // Verificar se o link já foi usado
          if (link.is_used) {
            console.log("Link mockado já utilizado");
            return { valid: false };
          }
          
          // Verificar se o link expirou
          if (new Date(link.expires_at) < new Date()) {
            console.log("Link mockado expirado");
            return { valid: false };
          }
          
          console.log("Link mockado válido");
          return {
            valid: true,
            leadId: link.lead_id
          };
        }
      }
      
      console.log("Token não encontrado nos mocks");
      return { valid: false };
    }
  } catch (e) {
    console.error('Erro ao validar token:', e);
    return { valid: false };
  }
};

export const updateClientRegistrationFormData = async (token: string, formData: any): Promise<boolean> => {
  try {
    try {
      const { error } = await supabase
        .from('client_registration_links')
        .update({ 
          is_used: true,
          form_data: formData
        })
        .eq('token', token);
      
      if (error) {
        console.error("Erro ao atualizar dados no supabase:", error);
        throw new Error(error.message);
      }
      
      return true;
    } catch (e) {
      // Em modo offline, atualizar no cache local
      for (const leadId in mockClientLinks) {
        const link = mockClientLinks[leadId];
        if (link.token === token) {
          mockClientLinks[leadId] = {
            ...link,
            is_used: true,
            form_data: formData
          };
          return true;
        }
      }
      
      return false;
    }
  } catch (e) {
    console.error('Erro ao atualizar dados do formulário:', e);
    return false;
  }
};
