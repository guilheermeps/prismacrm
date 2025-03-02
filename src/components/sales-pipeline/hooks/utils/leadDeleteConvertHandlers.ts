
import { toast } from "sonner";
import { Lead } from "@/lib/supabase/types";
import { deleteLead, updateLead } from "@/lib/supabase/leadsService";
import { addHistoryEntry } from "./leadHistoryUtils";

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
