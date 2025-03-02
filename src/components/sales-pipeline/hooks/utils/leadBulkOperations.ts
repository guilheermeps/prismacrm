
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const resetAllLeads = async (): Promise<boolean> => {
  try {
    // Excluir todos os leads
    const { error } = await supabase.from('leads').delete().neq('id', '0');
    
    if (error) {
      throw error;
    }
    
    toast.success("Todos os leads foram removidos com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao remover todos os leads:", error);
    toast.error("Erro ao remover todos os leads. Tente novamente.");
    return false;
  }
};
