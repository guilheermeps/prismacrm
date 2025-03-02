import { toast } from "sonner";
import { Lead } from "@/lib/supabase/types";
import { updateLead } from "@/lib/supabase/services/leadsCrudService";
import { addHistoryEntry } from "./leadHistoryUtils";

// Update lead name
export const updateLeadName = async (lead: Lead, newName: string): Promise<boolean> => {
  try {
    if (!newName) {
      toast.error("Nome não pode ser vazio");
      return false;
    }
    
    const updatedLead = {
      ...lead,
      name: newName,
      history: addHistoryEntry(lead.history, "updated_name", lead.name, newName)
    };
    
    await updateLead(updatedLead);
    
    toast.success("Nome atualizado com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar nome:", error);
    toast.error("Erro ao atualizar nome");
    return false;
  }
};

// Update service type
export const updateServiceType = async (lead: Lead, newServiceType: string): Promise<boolean> => {
  try {
    const updatedLead = {
      ...lead,
      serviceType: newServiceType,
      history: addHistoryEntry(lead.history, "updated_service_type", lead.serviceType || "", newServiceType)
    };
    
    await updateLead(updatedLead);
    
    toast.success("Tipo de serviço atualizado com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar tipo de serviço:", error);
    toast.error("Erro ao atualizar tipo de serviço");
    return false;
  }
};

// Update whatsapp
export const updateWhatsApp = async (lead: Lead, newWhatsApp: string): Promise<boolean> => {
  try {
    const updatedLead = {
      ...lead,
      whatsapp: newWhatsApp,
      history: addHistoryEntry(lead.history, "updated_whatsapp", lead.whatsapp || "", newWhatsApp)
    };
    
    await updateLead(updatedLead);
    
    toast.success("WhatsApp atualizado com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar WhatsApp:", error);
    toast.error("Erro ao atualizar WhatsApp");
    return false;
  }
};

// Update proposal value
export const updateProposalValue = async (lead: Lead, newValue: number): Promise<boolean> => {
  try {
    const oldValue = lead.proposalValue || 0;
    
    const updatedLead = {
      ...lead,
      proposalValue: newValue,
      history: addHistoryEntry(lead.history, "updated_value", oldValue.toString(), newValue.toString())
    };
    
    await updateLead(updatedLead);
    
    toast.success("Valor da proposta atualizado com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar valor da proposta:", error);
    toast.error("Erro ao atualizar valor da proposta");
    return false;
  }
};

// Create order or contract from lead (renamed from createTransactionFromLead to updateLeadForTransactionCreation)
export const updateLeadForTransactionCreation = async (
  lead: Lead, 
  transactionType: 'order' | 'contract'
): Promise<boolean> => {
  try {
    // Update lead history to show a transaction was created from it
    const updatedLead = {
      ...lead,
      history: addHistoryEntry(
        lead.history, 
        transactionType === 'order' ? 'created_order' : 'created_contract',
        null,
        null
      )
    };
    
    await updateLead(updatedLead);
    
    toast.success(`${transactionType === 'order' ? 'Pedido' : 'Contrato'} criado com sucesso`);
    return true;
  } catch (error) {
    console.error(`Erro ao criar ${transactionType}:`, error);
    toast.error(`Erro ao criar ${transactionType}`);
    return false;
  }
};
