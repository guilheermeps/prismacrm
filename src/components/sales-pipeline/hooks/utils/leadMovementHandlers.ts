
import { toast } from "sonner";
import { Lead } from "@/lib/supabase/types";
import { updateLead } from "@/lib/supabase/leadsService";
import { addHistoryEntry } from "./leadHistoryUtils";

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
    if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
      // Just update the local lead
      const updatedLead = {
        ...lead,
        stageId: toStageId,
        history: addHistoryEntry(lead.history, "moved", "Desconhecido", "Desconhecido")
      };
      
      console.log("Moving lead in dev/demo mode:", updatedLead);
      
      // Return success immediately for faster UI update
      return true;
    }
    
    const fromStageName = "Desconhecido";
    const toStageName = "Desconhecido"; 
    
    const updatedLead = {
      ...lead,
      stageId: toStageId,
      history: addHistoryEntry(lead.history, "moved", fromStageName, toStageName)
    };
    
    console.log("Updating lead:", updatedLead);
    
    // Try to update in Supabase
    const result = await updateLead(updatedLead);
    
    if (!result && (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true')) {
      console.log("Fallback to local update mode due to API error");
      // Return success for development mode
      return true;
    }
    
    // Delay the toast to avoid interfering with drag operation
    setTimeout(() => {
      toast.success("Lead movido para nova etapa!");
    }, 500);
    
    return true;
  } catch (error) {
    console.error("Erro ao mover lead:", error);
    
    // In development mode, allow the UI to update even if the API call fails
    if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
      console.log("Allowing move in development mode despite error");
      return true;
    }
    
    toast.error("Erro ao mover lead. Tente novamente.");
    return false;
  }
};
