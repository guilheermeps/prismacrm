
import { toast } from "sonner";
import { 
  createStage, 
  updateStage, 
  deleteStage,
  type Stage
} from "@/lib/supabase";

export const handleAddStage = async (newStage: Omit<Stage, 'id'>): Promise<boolean> => {
  try {
    const result = await createStage(newStage);
    
    if (result) {
      toast.success("Etapa adicionada com sucesso!");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao adicionar etapa:", error);
    toast.error("Erro ao adicionar etapa. Tente novamente.");
    return false;
  }
};

export const handleUpdateStage = async (updatedStage: Stage): Promise<boolean> => {
  try {
    const result = await updateStage(updatedStage);
    
    if (result) {
      toast.success("Etapa atualizada com sucesso!");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao atualizar etapa:", error);
    toast.error("Erro ao atualizar etapa. Tente novamente.");
    return false;
  }
};

export const handleDeleteStage = async (stageId: string): Promise<boolean> => {
  try {
    const success = await deleteStage(stageId);
    
    if (success) {
      toast.success("Etapa removida com sucesso!");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao remover etapa:", error);
    toast.error("Erro ao remover etapa. Tente novamente.");
    return false;
  }
};
