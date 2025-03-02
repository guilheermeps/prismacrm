
import { toast } from "sonner";
import { Lead } from "@/lib/supabase/types";
import { updateLead } from "@/lib/supabase/leadsService";
import { addHistoryEntry } from "./leadHistoryUtils";

/**
 * Checks if the application is running in development or demo mode
 */
const isDevOrDemoMode = (): boolean => {
  return import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true';
};

/**
 * Updates a lead in development/demo mode without calling the API
 */
const handleDevModeMoveOperation = (
  lead: Lead,
  toStageId: string,
  fromStageName: string = "Desconhecido",
  toStageName: string = "Desconhecido"
): boolean => {
  console.log("Moving lead in dev/demo mode:", lead.id, "to stage", toStageId);
  // Return success immediately for faster UI update
  return true;
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
    
    // Skip if already in the target stage
    if (lead.stageId === toStageId) {
      console.log(`Lead ${lead.id} already in stage ${toStageId}`);
      return true;
    }
    
    console.log(`Moving lead ${lead.id} from ${lead.stageId} to ${toStageId}`);
    
    // Development mode handling - immediate return for UI responsiveness
    if (isDevOrDemoMode()) {
      return handleDevModeMoveOperation(lead, toStageId);
    }
    
    const fromStageName = "Desconhecido";
    const toStageName = "Desconhecido"; 
    
    const updatedLead = {
      ...lead,
      stageId: toStageId,
      history: addHistoryEntry(lead.history, "moved", fromStageName, toStageName)
    };
    
    // Try to update in Supabase - but don't wait for the response to update UI
    updateLead(updatedLead).then(result => {
      if (!result && !isDevOrDemoMode()) {
        toast.error("Erro ao persistir a mudança de etapa do lead.");
      }
    });
    
    // Return true immediately for UI responsiveness
    return true;
  } catch (error) {
    console.error("Erro ao mover lead:", error);
    
    // In development mode, allow the UI to update even if the API call fails
    if (isDevOrDemoMode()) {
      console.log("Allowing move in development mode despite error");
      return true;
    }
    
    toast.error("Erro ao mover lead. Tente novamente.");
    return false;
  }
};
