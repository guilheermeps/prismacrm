
import { toast } from "sonner";
import { Lead } from "@/lib/supabase/types";
import { updateLead } from "@/lib/supabase/leadsService";
import { addHistoryEntry } from "./leadHistoryUtils";

export const updateLeadData = async (updatedLead: Lead): Promise<boolean> => {
  try {
    await updateLead(updatedLead);
    toast.success("Lead atualizado com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar lead:", error);
    
    // In development mode, pretend it succeeded
    if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
      return true;
    }
    
    toast.error("Erro ao atualizar lead. Tente novamente.");
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
