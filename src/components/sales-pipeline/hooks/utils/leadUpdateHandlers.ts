
import { toast } from "sonner";
import { Lead } from "@/lib/supabase/types";
import { updateLead } from "@/lib/supabase/leadsService";
import { addHistoryEntry } from "./leadHistoryUtils";

export const updateLeadData = async (updatedLead: Lead): Promise<boolean> => {
  try {
    // Se estamos em modo de desenvolvimento ou demo, mostrar mensagem
    if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
      // Log para depuração
      console.log('Atualizando lead em modo de desenvolvimento/demo:', updatedLead);
      // Simular sucesso e retornar true imediatamente
      toast.success("Lead atualizado com sucesso!");
      return true;
    }
    
    // Se não estamos em modo de desenvolvimento, continuar com a atualização
    await updateLead(updatedLead);
    toast.success("Lead atualizado com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar lead:", error);
    
    // Em modo de desenvolvimento, pretender que teve sucesso
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
