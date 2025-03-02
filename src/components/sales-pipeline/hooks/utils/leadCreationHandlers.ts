
import { toast } from "sonner";
import { Lead } from "@/lib/supabase/types";
import { createLead } from "@/lib/supabase/leadsService";
import { addHistoryEntry } from "./leadHistoryUtils";

export const addNewLead = async (
  newLead: Omit<Lead, 'id' | 'createdAt' | 'history' | 'isArchived'>
): Promise<boolean> => {
  try {
    const createdAt = new Date().toISOString();
    const stageName = "Desconhecido";
    
    const leadWithMetadata = {
      ...newLead,
      createdAt,
      isArchived: false,
      history: [
        {
          action: "created",
          timestamp: createdAt,
          from: null,
          to: stageName
        }
      ]
    };
    
    const result = await createLead(leadWithMetadata as Omit<Lead, 'id'>);
    
    if (result) {
      toast.success("Lead adicionado com sucesso!");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao adicionar lead:", error);
    toast.error("Erro ao adicionar lead. Tente novamente.");
    return false;
  }
};
