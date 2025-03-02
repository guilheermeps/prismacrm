
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  supabase, 
  getStages, 
  createStage, 
  updateStage, 
  deleteStage,
  type Stage
} from "@/lib/supabase";

// Initial mock data for stages, used only if no stages are found in Supabase
const initialStages = [
  { id: "1", title: "Novo Lead", color: "#4361ee" },
  { id: "2", title: "Proposta Enviada", color: "#3a86ff" },
  { id: "3", title: "Reunião Agendada", color: "#4cc9f0" },
  { id: "4", title: "Negociação", color: "#4895ef" },
  { id: "5", title: "Fechado (Ganho)", color: "#4cc9f0" },
  { id: "6", title: "Fechado (Perdido)", color: "#ff595e" },
];

export function useStageOperations() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStages = async () => {
      try {
        // Buscar estágios
        const stagesData = await getStages();
        
        // Se não houver estágios, inicializar com dados iniciais
        if (stagesData.length === 0) {
          // Criar estágios iniciais no Supabase
          const promises = initialStages.map(stage => 
            supabase.from('stages').insert(stage).select()
          );
          
          await Promise.all(promises);
          
          // Buscar novamente os estágios
          const newStagesData = await getStages();
          setStages(newStagesData);
        } else {
          setStages(stagesData);
        }
      } catch (error) {
        console.error("Erro ao carregar estágios:", error);
        toast.error("Erro ao carregar estágios. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    
    loadStages();
    
    // Configurar inscrição em tempo real para mudanças
    const stagesSubscription = supabase
      .channel('stages-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stages' }, () => {
        // Atualizar os estágios quando houver mudanças
        getStages().then(setStages);
      })
      .subscribe();
    
    // Limpar inscrições ao desmontar
    return () => {
      stagesSubscription.unsubscribe();
    };
  }, []);

  const handleAddStage = async (newStage: Omit<Stage, 'id'>) => {
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

  const handleUpdateStage = async (updatedStage: Stage) => {
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

  const handleDeleteStage = async (stageId: string) => {
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

  return {
    stages,
    loading: loading,
    handleAddStage,
    handleUpdateStage,
    handleDeleteStage
  };
}
