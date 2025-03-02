
import { toast } from "sonner";
import { Lead } from "@/lib/supabase/types";
import { updateLead } from "@/lib/supabase/services/leadsCrudService";
import { addHistoryEntry } from "./leadHistoryUtils";

// Move the lead forward
export const moveLeadForward = async (lead: Lead, stages: any[]): Promise<boolean> => {
  try {
    // Find current stage index
    const currentStageIndex = stages.findIndex(stage => stage.id === lead.stageId);
    
    // Check if this is the last stage
    if (currentStageIndex >= stages.length - 1) {
      toast.info("Este lead já está no último estágio");
      return false;
    }
    
    // Get the next stage
    const nextStage = stages[currentStageIndex + 1];
    
    // Update lead with new stage and history
    const updatedLead = {
      ...lead,
      stageId: nextStage.id,
      history: addHistoryEntry(lead.history, "moved", lead.stageId, nextStage.id)
    };
    
    // Update the lead
    await updateLead(updatedLead);
    
    toast.success(`Lead movido para ${nextStage.title}`);
    return true;
  } catch (error) {
    console.error("Erro ao mover lead para frente:", error);
    toast.error("Erro ao mover lead");
    return false;
  }
};

// Move the lead backward
export const moveLeadBackward = async (lead: Lead, stages: any[]): Promise<boolean> => {
  try {
    // Find current stage index
    const currentStageIndex = stages.findIndex(stage => stage.id === lead.stageId);
    
    // Check if this is the first stage
    if (currentStageIndex <= 0) {
      toast.info("Este lead já está no primeiro estágio");
      return false;
    }
    
    // Get the previous stage
    const prevStage = stages[currentStageIndex - 1];
    
    // Update lead with new stage and history
    const updatedLead = {
      ...lead,
      stageId: prevStage.id,
      history: addHistoryEntry(lead.history, "moved", lead.stageId, prevStage.id)
    };
    
    // Update the lead
    await updateLead(updatedLead);
    
    toast.success(`Lead movido para ${prevStage.title}`);
    return true;
  } catch (error) {
    console.error("Erro ao mover lead para trás:", error);
    toast.error("Erro ao mover lead");
    return false;
  }
};
