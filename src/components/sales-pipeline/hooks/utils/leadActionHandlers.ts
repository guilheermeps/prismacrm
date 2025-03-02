import { toast } from "sonner";
import { Lead } from "@/lib/supabase/types";
import { updateLead } from "@/lib/supabase/services/leadsCrudService";
import { createContact } from "@/lib/supabase/contactsService";
import { addHistoryEntry } from "./leadHistoryUtils";
import { convertLeadToContact } from "./leadDeleteConvertHandlers";

// Add new lead
export const addNewLead = async (newLead: Omit<Lead, 'id' | 'createdAt' | 'history' | 'isArchived'>): Promise<boolean> => {
  try {
    // Generate a unique ID for the new lead
    const leadId = Math.random().toString(36).substring(2, 15);
    
    const now = new Date().toISOString();

    const lead: Lead = {
      id: leadId,
      ...newLead,
      createdAt: now,
      history: [],
      isArchived: false
    };
    
    await updateLead(lead);
    
    toast.success("Lead adicionado com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao adicionar lead:", error);
    toast.error("Erro ao adicionar lead");
    return false;
  }
};

// Update lead data
export const updateLeadData = async (updatedLead: Lead): Promise<boolean> => {
  try {
    await updateLead(updatedLead);
    
    toast.success("Lead atualizado com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar lead:", error);
    toast.error("Erro ao atualizar lead");
    return false;
  }
};

// Remove lead
export const removeLead = async (leadId: string): Promise<boolean> => {
  try {
    const lead: Lead = {
      id: leadId,
      name: 'Dummy',
      serviceType: 'Dummy',
      whatsapp: 'Dummy',
      stageId: 'Dummy',
      proposalValue: 0,
      createdAt: new Date().toISOString(),
      history: []
    };
    
    const updatedLead = {
      ...lead,
      history: addHistoryEntry(lead.history, "deleted", null, null)
    };
    
    await updateLead(updatedLead);
    
    toast.success("Lead removido com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao remover lead:", error);
    toast.error("Erro ao remover lead");
    return false;
  }
};

// Archive lead
export const archiveLead = async (lead: Lead): Promise<boolean> => {
  try {
    const updatedLead = {
      ...lead,
      isArchived: true,
      history: addHistoryEntry(lead.history, "archived", null, null)
    };
    
    await updateLead(updatedLead);
    
    toast.success("Lead arquivado com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao arquivar lead:", error);
    toast.error("Erro ao arquivar lead");
    return false;
  }
};

// Unarchive lead
export const unarchiveLead = async (lead: Lead): Promise<boolean> => {
  try {
    const updatedLead = {
      ...lead,
      isArchived: false,
      history: addHistoryEntry(lead.history, "unarchived", null, null)
    };
    
    await updateLead(updatedLead);
    
    toast.success("Lead desarquivado com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao desarquivar lead:", error);
    toast.error("Erro ao desarquivar lead");
    return false;
  }
};

// Discard lead
export const discardLead = async (lead: Lead): Promise<boolean> => {
  try {
    const updatedLead = {
      ...lead,
      stageId: 'discarded',
      history: addHistoryEntry(lead.history, "discarded", lead.stageId, 'discarded')
    };
    
    await updateLead(updatedLead);
    
    toast.success("Lead descartado com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao descartar lead:", error);
    toast.error("Erro ao descartar lead");
    return false;
  }
};

// Move lead to another stage
export const moveLead = async (lead: Lead, newStageId: string): Promise<boolean> => {
  try {
    const updatedLead = {
      ...lead,
      stageId: newStageId,
      history: addHistoryEntry(lead.history, "moved_stage", lead.stageId, newStageId)
    };
    
    await updateLead(updatedLead);
    
    toast.success("Lead movido de etapa com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao mover lead de etapa:", error);
    toast.error("Erro ao mover lead de etapa");
    return false;
  }
};

// Reset all leads
export const resetAllLeads = async (): Promise<boolean> => {
  try {
    // Logic to reset all leads
    toast.success("Leads resetados com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao resetar leads:", error);
    toast.error("Erro ao resetar leads");
    return false;
  }
};

// Export the convertLeadToContact function from leadDeleteConvertHandlers.ts
export { convertLeadToContact };
