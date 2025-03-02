
import { toast } from "sonner";
import { 
  createLead, 
  updateLead,
  deleteLead
} from "@/lib/supabase/services/leadsCrudService";
import { Lead } from "@/lib/supabase/types";
import { addHistoryEntry } from "./leadHistoryUtils";

// Add a new lead
export const addNewLead = async (
  lead: Omit<Lead, 'id' | 'createdAt' | 'history' | 'isArchived'>
): Promise<boolean> => {
  try {
    // Validate lead data
    if (!lead.name || !lead.stageId) {
      toast.error("Nome e estágio são obrigatórios");
      return false;
    }
    
    // Create history for the new lead
    const history = addHistoryEntry([], "created", null, null);
    
    // Create the lead object to be sent to API
    const newLead = {
      ...lead,
      isArchived: false,
      createdAt: new Date().toISOString(),
      history: history,
    };

    // Send to API
    await createLead(newLead);
    toast.success("Lead criado com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao adicionar lead:", error);
    toast.error("Erro ao criar lead");
    return false;
  }
};

// Update lead data
export const updateLeadData = async (lead: Lead): Promise<boolean> => {
  try {
    // Add history entry for the update
    const updatedLead = {
      ...lead,
      history: addHistoryEntry(lead.history, "updated", null, null)
    };
    
    // Send to API
    await updateLead(updatedLead);
    toast.success("Lead atualizado com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar lead:", error);
    toast.error("Erro ao atualizar lead");
    return false;
  }
};

// Remove a lead
export const removeLead = async (leadId: string): Promise<boolean> => {
  try {
    // First check if we have the lead id
    if (!leadId) {
      toast.error("ID do lead é obrigatório");
      return false;
    }

    // Remove from API
    await deleteLead(leadId);
    toast.success("Lead removido com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao remover lead:", error);
    toast.error("Erro ao remover lead");
    return false;
  }
};

// Archive a lead
export const archiveLead = async (lead: Lead): Promise<boolean> => {
  try {
    const updatedLead = {
      ...lead,
      isArchived: true,
      history: addHistoryEntry(lead.history, "archived", null, null)
    };
    
    const result = await updateLead(updatedLead);
    
    if (result) {
      toast.success("Lead arquivado com sucesso!");
      return true;
    } else {
      throw new Error("Falha ao arquivar lead");
    }
  } catch (error) {
    console.error("Erro ao arquivar lead:", error);
    toast.error("Erro ao arquivar lead");
    return false;
  }
};

// Unarchive a lead
export const unarchiveLead = async (lead: Lead): Promise<boolean> => {
  try {
    const updatedLead = {
      ...lead,
      isArchived: false,
      history: addHistoryEntry(lead.history, "unarchived", null, null)
    };
    
    const result = await updateLead(updatedLead);
    
    if (result) {
      toast.success("Lead reativado com sucesso!");
      return true;
    } else {
      throw new Error("Falha ao reativar lead");
    }
  } catch (error) {
    console.error("Erro ao reativar lead:", error);
    toast.error("Erro ao reativar lead");
    return false;
  }
};

// Discard a lead (similar to archive but with a different status for reporting)
export const discardLead = async (lead: Lead): Promise<boolean> => {
  try {
    const updatedLead = {
      ...lead,
      isArchived: true,
      history: addHistoryEntry(lead.history, "discarded", null, null)
    };
    
    const result = await updateLead(updatedLead);
    
    if (result) {
      toast.success("Lead descartado com sucesso!");
      return true;
    } else {
      throw new Error("Falha ao descartar lead");
    }
  } catch (error) {
    console.error("Erro ao descartar lead:", error);
    toast.error("Erro ao descartar lead");
    return false;
  }
};

// Move lead to new stage
export const moveLead = async (lead: Lead, newStageId: string): Promise<boolean> => {
  try {
    if (!newStageId) {
      toast.error("ID do novo estágio é obrigatório");
      return false;
    }
    
    // Update the lead with new stage and history
    const updatedLead = {
      ...lead,
      stageId: newStageId,
      history: addHistoryEntry(lead.history, "moved", lead.stageId, newStageId)
    };
    
    const result = await updateLead(updatedLead);
    
    if (result) {
      return true;
    } else {
      throw new Error("Falha ao mover lead");
    }
  } catch (error) {
    console.error("Erro ao mover lead:", error);
    toast.error("Erro ao mover lead");
    return false;
  }
};
