
import { toast } from "sonner";
import { Lead } from "@/lib/supabase/types";
import { updateLead, isDevOrDemoMode } from "@/lib/supabase/leadsService";
import { addHistoryEntry } from "./leadHistoryUtils";

export const updateLeadData = async (updatedLead: Lead): Promise<boolean> => {
  try {
    const result = await updateLead(updatedLead);
    
    if (!result) {
      console.error("Erro ao atualizar lead no banco de dados");
      
      // In development mode, pretend it succeeded
      if (isDevOrDemoMode()) {
        toast.success("Lead atualizado com sucesso! (Modo de desenvolvimento)");
        return true;
      }
      
      toast.error("Erro ao atualizar lead. Tente novamente.");
      return false;
    }
    
    toast.success("Lead atualizado com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar lead:", error);
    
    // In development mode, pretend it succeeded
    if (isDevOrDemoMode()) {
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
    
    const result = await updateLead(updatedLead);
    
    if (!result) {
      console.error("Erro ao arquivar lead no banco de dados");
      toast.error("Erro ao arquivar lead. Tente novamente.");
      return false;
    }
    
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
    
    const result = await updateLead(updatedLead);
    
    if (!result) {
      console.error("Erro ao restaurar lead no banco de dados");
      toast.error("Erro ao restaurar lead. Tente novamente.");
      return false;
    }
    
    toast.success("Lead restaurado com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao restaurar lead:", error);
    toast.error("Erro ao restaurar lead. Tente novamente.");
    return false;
  }
};
