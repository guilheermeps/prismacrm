
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
 * Gets the name of a stage by ID from the provided stages
 * Note: In the future this should be retrieved from the database
 * @param stageId The ID of the stage
 * @returns The name of the stage or "Desconhecido" if not found
 */
const getStageName = (stageId: string): string => {
  // This is a placeholder. In a real implementation, we would fetch the stage name
  // from the database or from application state
  return "Etapa " + stageId.substring(0, 4);
};

/**
 * Updates a lead in development/demo mode
 */
const handleDevModeMoveOperation = async (
  lead: Lead,
  toStageId: string
): Promise<boolean> => {
  const fromStageName = getStageName(lead.stageId);
  const toStageName = getStageName(toStageId);
  
  // Create updated lead with the new stageId and history entry
  const updatedLead = {
    ...lead,
    stageId: toStageId,
    history: addHistoryEntry(lead.history, "moved", fromStageName, toStageName)
  };
  
  console.log("Moving lead in dev/demo mode:", updatedLead);
  
  try {
    // In dev mode, we still want to call updateLead to trigger any UI updates
    // This helps simulate the production behavior
    await updateLead(updatedLead);
    
    // Show feedback toast with a delay to not disrupt drag operation
    setTimeout(() => {
      toast.success(`Lead movido para ${toStageName}!`);
    }, 500);
    
    return true;
  } catch (error) {
    console.log('Dev mode - ignoring update error:', error);
    return true; // Return success in dev mode even if API call fails
  }
};

/**
 * Moves a lead to a different stage
 * @param lead The lead to move
 * @param toStageId The target stage ID
 * @returns Promise<boolean> Success status
 */
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
    
    // Development mode handling
    if (isDevOrDemoMode()) {
      return await handleDevModeMoveOperation(lead, toStageId);
    }
    
    // Get stage names for history
    const fromStageName = getStageName(lead.stageId);
    const toStageName = getStageName(toStageId);
    
    // Create updated lead with new stageId and history entry
    const updatedLead = {
      ...lead,
      stageId: toStageId,
      history: addHistoryEntry(lead.history, "moved", fromStageName, toStageName)
    };
    
    console.log("Updating lead in database:", updatedLead);
    
    // Try to update in Supabase
    const result = await updateLead(updatedLead);
    
    if (!result) {
      if (isDevOrDemoMode()) {
        console.log("Fallback to local update mode due to API error");
        // Return success for development mode
        return true;
      }
      
      toast.error("Erro ao mover lead. Tente novamente.");
      return false;
    }
    
    // Delay the toast to avoid interfering with drag operation
    setTimeout(() => {
      toast.success(`Lead movido para ${toStageName}!`);
    }, 500);
    
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
