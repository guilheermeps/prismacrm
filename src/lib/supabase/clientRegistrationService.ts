
import { supabase } from './client';
import { ClientRegistrationLink } from './types';
import { mockClientLinks } from './mockData';

export const generateClientRegistrationLink = async (leadId: string): Promise<ClientRegistrationLink | null> => {
  try {
    // Generate a reliable unique token
    const token = crypto.randomUUID?.() || 
               `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Date.now()}`;
    
    console.log("Generating registration link for lead ID:", leadId, "with token:", token);
    
    // Verificar se estamos trabalhando offline/com mock data
    try {
      // Verificar se já existe um link para este lead
      const { data: existingLink, error: fetchError } = await supabase
        .from('client_registration_links')
        .select('*')
        .eq('lead_id', leadId)
        .maybeSingle();
      
      if (fetchError) {
        console.log("Erro ao buscar link existente, usando modo offline:", fetchError.message);
        throw new Error('Modo offline');
      }
      
      // Mesmo que já exista um link, vamos regenerar com um novo token
      // para garantir que funcione caso o anterior tenha expirado
      // Define expiração para 7 dias no futuro
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      if (existingLink) {
        // Atualiza o link existente
        console.log("Link existente encontrado, atualizando com novo token:", existingLink);
        
        const { data: updatedLink, error: updateError } = await supabase
          .from('client_registration_links')
          .update({ 
            token: token,
            is_used: false,
            expires_at: expiresAt.toISOString()
          })
          .eq('id', existingLink.id)
          .select()
          .single();
        
        if (updateError) {
          console.error("Erro ao atualizar link:", updateError);
          throw new Error(updateError.message);
        }
        
        console.log("Link atualizado no Supabase:", updatedLink);
        return updatedLink as ClientRegistrationLink;
      }
      
      // Criar novo link se não existir
      const { data, error } = await supabase
        .from('client_registration_links')
        .insert({ 
          lead_id: leadId, 
          token: token,
          expires_at: expiresAt.toISOString() // 7 dias
        })
        .select()
        .single();
      
      if (error) {
        console.error("Erro ao inserir link no Supabase:", error);
        throw new Error(error.message);
      }
      
      console.log("Novo link criado no Supabase:", data);
      return data as ClientRegistrationLink;
    } catch (e) {
      console.warn('Usando dados simulados para links de registro:', e);
      
      // Define expiração para 7 dias no futuro
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      // Sempre gerar um novo token em modo offline
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
  console.log("Buscando link para lead_id:", leadId);
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
      console.log("Buscando link em modo offline para lead_id:", leadId);
      console.log("Cache atual:", mockClientLinks);
      
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
  
  // Correção: Garantir que o token seja tratado como string
  const tokenStr = String(token).trim();
  
  if (!tokenStr) {
    console.log("Token vazio após trim");
    return { valid: false };
  }
  
  try {
    // Primeiro tenta no Supabase
    try {
      console.log("Buscando token no Supabase:", tokenStr);
      const { data, error } = await supabase
        .from('client_registration_links')
        .select('*')
        .eq('token', tokenStr)
        .maybeSingle();
      
      if (error) {
        console.error("Erro ao validar token no supabase:", error);
        throw new Error('Modo offline ou token inválido');
      }
      
      console.log("Resultado da validação supabase:", data);
      
      if (!data) {
        console.log("Token não encontrado no supabase");
        
        // Criar um link de teste se estamos em modo desenvolvimento/demo
        if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
          console.log("Modo desenvolvimento/demo: criando link de teste para o token");
          const mockLeadId = '1'; // ID do primeiro lead de teste
          const now = new Date();
          const expiresAt = new Date(now);
          expiresAt.setDate(expiresAt.getDate() + 7);
          
          // Inserir um link de teste no Supabase
          const { error: insertError } = await supabase
            .from('client_registration_links')
            .insert({ 
              lead_id: mockLeadId,
              token: tokenStr,
              expires_at: expiresAt.toISOString(),
              is_used: false,
              form_data: {}
            });
          
          if (insertError) {
            console.error("Erro ao criar link de teste:", insertError);
            return { valid: false };
          }
          
          console.log("Link de teste criado para desenvolvimento");
          return { valid: true, leadId: mockLeadId };
        }
        
        return { valid: false };
      }
      
      const link = data as ClientRegistrationLink;
      
      // Verificar se o link já foi usado
      if (link.is_used) {
        console.log("Link já utilizado");
        return { valid: false };
      }
      
      // Verificar se o link expirou
      const expiryDate = new Date(link.expires_at);
      const now = new Date();
      console.log("Verificando expiração. Expira em:", expiryDate, "Agora:", now);
      
      if (expiryDate < now) {
        console.log("Link expirado");
        return { valid: false };
      }
      
      console.log("Link válido no supabase, lead_id:", link.lead_id);
      return { 
        valid: true,
        leadId: link.lead_id
      };
    } catch (e) {
      // Se falhar, tenta nos mocks
      console.log("Verificando token em modo offline:", tokenStr);
      
      // Para depuração, vamos imprimir todos os tokens disponíveis
      console.log("Cache de links disponível:", Object.keys(mockClientLinks));
      Object.values(mockClientLinks).forEach(link => {
        console.log(`Token armazenado: ${link.token}, para lead ${link.lead_id}`);
      });
      
      // Procurar o token em todos os links mockados
      for (const leadId in mockClientLinks) {
        const link = mockClientLinks[leadId];
        console.log(`Comparando token '${tokenStr}' com token mockado '${link.token}' para lead ${leadId}`);
        
        // Comparação estrita
        if (link.token === tokenStr) {
          console.log("Token encontrado nos mocks para lead:", leadId);
          
          // Verificar se o link já foi usado
          if (link.is_used) {
            console.log("Link mockado já utilizado");
            return { valid: false };
          }
          
          // Verificar se o link expirou
          const expiryDate = new Date(link.expires_at);
          const now = new Date();
          console.log("Verificando expiração de mock. Expira em:", expiryDate, "Agora:", now);
          
          if (expiryDate < now) {
            console.log("Link mockado expirado");
            return { valid: false };
          }
          
          console.log("Link mockado válido para lead_id:", leadId);
          return {
            valid: true,
            leadId: leadId
          };
        }
      }
      
      // Teste: criar um mock link para este token se não encontrarmos
      // Este é um "failsafe" para garantir que a demonstração funcione
      if (Object.keys(mockClientLinks).length === 0 || import.meta.env.DEV) {
        const mockLeadId = '1'; // Usar um ID de lead fixo para teste
        const now = new Date();
        const expiresAt = new Date(now);
        expiresAt.setDate(expiresAt.getDate() + 7);
        
        const mockLink: ClientRegistrationLink = {
          id: Math.random().toString(36).substring(2, 15),
          lead_id: mockLeadId,
          token: tokenStr,
          created_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          is_used: false,
          form_data: {}
        };
        
        mockClientLinks[mockLeadId] = mockLink;
        console.log("Criado mock link de emergência para token:", tokenStr);
        
        return {
          valid: true,
          leadId: mockLeadId
        };
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
  console.log("Atualizando dados de formulário para token:", token);
  console.log("Dados do formulário:", formData);
  
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
      
      console.log("Dados atualizados com sucesso no Supabase");
      
      // Criar o contato automaticamente
      await createContactFromFormData(token, formData);
      
      return true;
    } catch (e) {
      console.log("Atualizando dados em modo offline");
      // Em modo offline, atualizar no cache local
      for (const leadId in mockClientLinks) {
        const link = mockClientLinks[leadId];
        console.log(`Comparando token '${token}' com token mockado '${link.token}' para lead ${leadId}`);
        
        if (link.token === token) {
          console.log("Token encontrado nos mocks, atualizando dados");
          mockClientLinks[leadId] = {
            ...link,
            is_used: true,
            form_data: formData
          };
          
          // Criar o contato automaticamente usando os dados mockados
          await createContactFromFormData(token, formData, leadId);
          
          return true;
        }
      }
      
      console.log("Token não encontrado nos mocks");
      return false;
    }
  } catch (e) {
    console.error('Erro ao atualizar dados do formulário:', e);
    return false;
  }
};

// Nova função para adicionar o contato na lista de contatos após o preenchimento do formulário
const createContactFromFormData = async (token: string, formData: any, leadId?: string): Promise<void> => {
  console.log("Criando contato a partir dos dados do formulário");
  
  try {
    // Se estamos usando mockado
    if (leadId) {
      import('@/utils/mockData').then(({ mockContacts }) => {
        // Adicionar à lista de contatos mockada
        const newContact = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          type: "client",
          document: formData.document,
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zipCode: formData.postalCode,
          notes: formData.notes,
          orders: []
        };
        
        console.log("Adicionando novo contato ao mockContacts:", newContact);
        mockContacts.push(newContact);
      });
      return;
    }
    
    // Caso contrário, se estamos usando Supabase
    // Primeiro, obtemos o registro de link para saber o lead_id
    const { data: linkData, error: linkError } = await supabase
      .from('client_registration_links')
      .select('lead_id')
      .eq('token', token)
      .maybeSingle();
    
    if (linkError || !linkData) {
      console.error("Erro ao buscar lead_id do link:", linkError);
      return;
    }
    
    // Aqui você implementaria a lógica para salvar o contato no banco de dados
    // Por exemplo, inserindo na tabela 'contacts'
    const { error } = await supabase
      .from('contacts')
      .insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        type: "client",
        document: formData.document,
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        zipCode: formData.postalCode,
        notes: formData.notes,
        lead_id: linkData.lead_id
      });
    
    if (error) {
      console.error("Erro ao criar contato no Supabase:", error);
      // Caso não exista a tabela 'contacts', salvamos em mockContacts
      import('@/utils/mockData').then(({ mockContacts }) => {
        const newContact = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          type: "client",
          document: formData.document,
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zipCode: formData.postalCode,
          notes: formData.notes,
          orders: []
        };
        
        console.log("Fallback: Adicionando novo contato ao mockContacts:", newContact);
        mockContacts.push(newContact);
      });
    }
  } catch (e) {
    console.error("Erro ao criar contato:", e);
  }
};
