
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
 * Handles lead movement in development/demo mode
 */
const handleDevModeMoveOperation = async (
  lead: Lead,
  toStageId: string,
  fromStageName: string = "Desconhecido",
  toStageName: string = "Desconhecido"
): Promise<boolean> => {
  console.log("Moving lead in dev/demo mode:", lead.id, "to stage", toStageId);
  
  try {
    // Even in dev mode, we'll update the lead to ensure persistence
    const updatedLead = {
      ...lead,
      stageId: toStageId,
      history: addHistoryEntry(lead.history, "moved", fromStageName, toStageName)
    };
    
    // In dev mode, we still want to persist changes
    await updateLead(updatedLead);
    return true;
  } catch (error) {
    console.error("Dev mode error:", error);
    return true; // Still return true in dev mode for UI responsiveness
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
    
    // Skip if already in the target stage
    if (lead.stageId === toStageId) {
      console.log(`Lead ${lead.id} already in stage ${toStageId}`);
      return true;
    }
    
    console.log(`Moving lead ${lead.id} from ${lead.stageId} to ${toStageId}`);
    
    // Get stage names for better history tracking (this should be improved to get actual names)
    const fromStageName = "Desconhecido";
    const toStageName = "Desconhecido"; 
    
    // Development mode handling
    if (isDevOrDemoMode()) {
      return await handleDevModeMoveOperation(lead, toStageId, fromStageName, toStageName);
    }
    
    // Create updated lead with new stage and history entry
    const updatedLead = {
      ...lead,
      stageId: toStageId,
      history: addHistoryEntry(lead.history, "moved", fromStageName, toStageName)
    };
    
    // Persist the change to database - await the result to ensure it's saved
    const result = await updateLead(updatedLead);
    
    if (!result) {
      console.error("Failed to update lead in database");
      if (!isDevOrDemoMode()) {
        toast.error("Erro ao persistir a mudança de etapa do lead.");
        return false;
      }
    }
    
    // Return success
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
