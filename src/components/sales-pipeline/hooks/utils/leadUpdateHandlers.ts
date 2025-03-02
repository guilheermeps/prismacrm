
import { toast } from "sonner";
import { Lead } from "@/lib/supabase/types";
import { updateLead } from "@/lib/supabase/leadsService";
import { addHistoryEntry } from "./leadHistoryUtils";

export const updateLeadData = async (updatedLead: Lead): Promise<boolean> => {
  try {
    // Log for debugging
    console.log('Updating lead:', updatedLead);
    
    // If we're in development or demo mode, show message but allow realtime updates
    if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
      console.log('Updating lead in development/demo mode:', updatedLead);
      
      // In dev mode, we still want to call updateLead to trigger the realtime updates
      // This helps simulate the production behavior
      try {
        await updateLead(updatedLead);
      } catch (error) {
        console.log('Dev mode - ignoring update error:', error);
      }
      
      // Show success message
      toast.success("Lead atualizado com sucesso!");
      return true;
    }
    
    // If not in development mode, continue with the update
    const result = await updateLead(updatedLead);
    
    if (result) {
      toast.success("Lead atualizado com sucesso!");
      return true;
    } else {
      throw new Error("Failed to update lead");
    }
  } catch (error) {
    console.error("Erro ao atualizar lead:", error);
    
    // In development mode, pretend success
    if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
      return true;
    }
    
    toast.error("Erro ao atualizar lead. Tente novamente.");
    return false;
  }
};

export const archiveLead = async (lead: Lead): Promise<boolean> => {
  try {
    console.log('Archiving lead:', lead.id);
    
    const updatedLead = {
      ...lead,
      isArchived: true,
      history: addHistoryEntry(lead.history, "archived")
    };
    
    const result = await updateLead(updatedLead);
    
    if (result) {
      toast.success("Lead arquivado com sucesso!");
      return true;
    } else {
      throw new Error("Failed to archive lead");
    }
  } catch (error) {
    console.error("Erro ao arquivar lead:", error);
    
    // In development mode, pretend success
    if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
      return true;
    }
    
    toast.error("Erro ao arquivar lead. Tente novamente.");
    return false;
  }
};

export const unarchiveLead = async (lead: Lead): Promise<boolean> => {
  try {
    console.log('Unarchiving lead:', lead.id);
    
    const updatedLead = {
      ...lead,
      isArchived: false,
      history: addHistoryEntry(lead.history, "unarchived")
    };
    
    const result = await updateLead(updatedLead);
    
    if (result) {
      toast.success("Lead restaurado com sucesso!");
      return true;
    } else {
      throw new Error("Failed to unarchive lead");
    }
  } catch (error) {
    console.error("Erro ao restaurar lead:", error);
    
    // In development mode, pretend success
    if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
      return true;
    }
    
    toast.error("Erro ao restaurar lead. Tente novamente.");
    return false;
  }
};
