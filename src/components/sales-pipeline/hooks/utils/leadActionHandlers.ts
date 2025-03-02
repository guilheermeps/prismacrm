import { toast } from "sonner";
import { Lead } from "@/lib/supabase/types";
import { createLead, updateLead, deleteLead } from "@/lib/supabase/leadsService";
import { addHistoryEntry } from "./leadHistoryUtils";

export const addNewLead = async (
  newLead: Omit<Lead, 'id' | 'createdAt' | 'history' | 'isArchived'>
): Promise<boolean> => {
  try {
    const createdAt = new Date().toISOString();
    const stageName = "Desconhecido";
    
    const leadWithMetadata = {
      ...newLead,
      createdAt,
      isArchived: false,
      history: [
        {
          action: "created",
          timestamp: createdAt,
          from: null,
          to: stageName
        }
      ]
    };
    
    const result = await createLead(leadWithMetadata as Omit<Lead, 'id'>);
    
    if (result) {
      toast.success("Lead adicionado com sucesso!");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao adicionar lead:", error);
    toast.error("Erro ao adicionar lead. Tente novamente.");
    return false;
  }
};

export const moveLead = async (
  lead: Lead | undefined,
  toStageId: string
): Promise<boolean> => {
  try {
    if (!lead) {
      console.error("Tentativa de mover um lead indefinido");
      return false;
    }
    
    console.log(`Moving lead ${lead.id} from ${lead.stageId} to ${toStageId}`);
    
    // Development mode handling
    if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
      // Just update the local lead
      const updatedLead = {
        ...lead,
        stageId: toStageId,
        history: addHistoryEntry(lead.history, "moved", "Desconhecido", "Desconhecido")
      };
      
      console.log("Moving lead in dev/demo mode:", updatedLead);
      toast.success(`Lead movido para nova etapa!`);
      return true;
    }
    
    const fromStageName = "Desconhecido";
    const toStageName = "Desconhecido"; 
    
    const updatedLead = {
      ...lead,
      stageId: toStageId,
      history: addHistoryEntry(lead.history, "moved", fromStageName, toStageName)
    };
    
    await updateLead(updatedLead);
    toast.success(`Lead movido para nova etapa!`);
    return true;
  } catch (error) {
    console.error("Erro ao mover lead:", error);
    toast.error("Erro ao mover lead. Tente novamente.");
    return false;
  }
};

export const updateLeadData = async (updatedLead: Lead): Promise<boolean> => {
  try {
    await updateLead(updatedLead);
    toast.success("Lead atualizado com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar lead:", error);
    toast.error("Erro ao atualizar lead. Tente novamente.");
    return false;
  }
};

export const removeLead = async (leadId: string): Promise<boolean> => {
  try {
    const success = await deleteLead(leadId);
    
    if (success) {
      toast.success("Lead removido com sucesso!");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao remover lead:", error);
    toast.error("Erro ao remover lead. Tente novamente.");
    return false;
  }
};

export const archiveLead = async (lead: Lead): Promise<boolean> => {
  try {
    const updatedLead = {
      ...lead,
      isArchived: true,
      history: addHistoryEntry(lead.history, "archived")
    };
    
    await updateLead(updatedLead);
    toast.success("Lead arquivado com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao arquivar lead:", error);
    toast.error("Erro ao arquivar lead. Tente novamente.");
    return false;
  }
};

export const unarchiveLead = async (lead: Lead): Promise<boolean> => {
  try {
    const updatedLead = {
      ...lead,
      isArchived: false,
      history: addHistoryEntry(lead.history, "unarchived")
    };
    
    await updateLead(updatedLead);
    toast.success("Lead restaurado com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao restaurar lead:", error);
    toast.error("Erro ao restaurar lead. Tente novamente.");
    return false;
  }
};

export const convertLeadToContact = async (lead: Lead): Promise<boolean> => {
  try {
    // Archive the lead after conversion
    const updatedLead = {
      ...lead,
      isArchived: true,
      history: addHistoryEntry(lead.history, "converted")
    };
    
    await updateLead(updatedLead);
    return true;
  } catch (error) {
    console.error("Erro ao converter para contato:", error);
    toast.error("Erro ao converter para contato. Tente novamente.");
    return false;
  }
};
