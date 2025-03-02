
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  supabase, 
  getStages,
  type Stage
} from "@/lib/supabase";
import { initialStages } from "./utils/stageUtils";
import { 
  handleAddStage as addStage,
  handleUpdateStage as updateStage,
  handleDeleteStage as deleteStage
} from "./utils/stageActionHandlers";

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

  return {
    stages,
    loading,
    handleAddStage: addStage,
    handleUpdateStage: updateStage,
    handleDeleteStage: deleteStage
  };
}
