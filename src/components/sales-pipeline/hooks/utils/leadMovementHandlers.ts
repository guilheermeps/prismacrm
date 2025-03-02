
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
  console.log("Movendo lead no modo de desenvolvimento:", lead.id, "para estágio", toStageId);
  
  try {
    // Even in dev mode, we'll update the lead to ensure persistence
    const updatedLead = {
      ...lead,
      stageId: toStageId,
      history: addHistoryEntry(lead.history, "moved", fromStageName, toStageName)
    };
    
    // In dev mode, we still want to persist changes
    const result = await updateLead(updatedLead);
    
    // Check if the update was successful
    if (!result) {
      console.error("Falha ao atualizar lead no banco de dados mesmo no modo dev");
      return false;
    }
    
    console.log("Lead movido com sucesso no modo de desenvolvimento");
    return true;
  } catch (error) {
    console.error("Erro no modo de desenvolvimento:", error);
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
    
    // Skip if already in the target stage
    if (lead.stageId === toStageId) {
      console.log(`Lead ${lead.id} já está no estágio ${toStageId}`);
      return true;
    }
    
    console.log(`Movendo lead ${lead.id} do estágio ${lead.stageId} para ${toStageId}`);
    
    // Get stage names for better history tracking
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
    
    console.log("Atualizando lead no banco de dados com novo estágio:", updatedLead);
    
    // Persist the change to database - await the result to ensure it's saved
    const result = await updateLead(updatedLead);
    
    if (!result) {
      console.error("Falha ao atualizar lead no banco de dados");
      toast.error("Erro ao persistir a mudança de etapa do lead. Tente novamente.");
      return false;
    }
    
    console.log("Lead movido com sucesso:", lead.id);
    toast.success("Lead movido com sucesso!");
    
    // Return success
    return true;
  } catch (error) {
    console.error("Erro ao mover lead:", error);
    
    // Always show error toast regardless of mode
    toast.error("Erro ao persistir a mudança de etapa do lead. Tente novamente.");
    return false;
  }
};
