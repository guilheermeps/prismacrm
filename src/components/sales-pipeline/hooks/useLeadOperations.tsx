
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  supabase, 
  getLeads, 
  createLead, 
  updateLead, 
  deleteLead,
  type Lead
} from "@/lib/supabase";

export function useLeadOperations() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const leadsData = await getLeads();
        setLeads(leadsData);
      } catch (error) {
        console.error("Erro ao carregar leads:", error);
        toast.error("Erro ao carregar leads. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    
    loadLeads();
    
    // Configurar inscrição em tempo real para mudanças
    const leadsSubscription = supabase
      .channel('leads-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        // Atualizar os leads quando houver mudanças
        getLeads().then(setLeads);
      })
      .subscribe();
    
    // Limpar inscrições ao desmontar
    return () => {
      leadsSubscription.unsubscribe();
    };
  }, []);

  const handleAddNewLead = async (newLead: Omit<Lead, 'id' | 'createdAt' | 'history' | 'isArchived'>) => {
    try {
      const createdAt = new Date().toISOString();
      const stageName = leads.length > 0 ? "" : "Desconhecido";
      
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

  const handleMoveLead = async (leadId: string, fromStageId: string, toStageId: string) => {
    try {
      const lead = leads.find(l => l.id === leadId);
      
      if (!lead) return;
      
      const fromStageName = "Desconhecido";
      const toStageName = "Desconhecido"; 
      
      const updatedLead = {
        ...lead,
        stageId: toStageId,
        history: [
          ...lead.history,
          {
            action: "moved",
            timestamp: new Date().toISOString(),
            from: fromStageName,
            to: toStageName
          }
        ]
      };
      
      await updateLead(updatedLead);
      return true;
    } catch (error) {
      console.error("Erro ao mover lead:", error);
      toast.error("Erro ao mover lead. Tente novamente.");
      return false;
    }
  };

  const handleUpdateLead = async (updatedLead: Lead) => {
    try {
      await updateLead(updatedLead);
      toast.success("Lead atualizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao atualizar lead:", error);
      toast.error("Erro ao atualizar lead. Tente novamente.");
      return false;
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      const success = await deleteLead(leadId);
      
      if (success) {
        toast.success("Lead removido com sucesso!");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao remover lead:", error);
      toast.error("Erro ao remover lead. Tente novamente.");
      return false;
    }
  };

  const handleArchiveLead = async (lead: Lead) => {
    try {
      const updatedLead = {
        ...lead,
        isArchived: true,
        history: [
          ...lead.history,
          {
            action: "archived",
            timestamp: new Date().toISOString(),
            from: null,
            to: null
          }
        ]
      };
      
      await updateLead(updatedLead);
      toast.success("Lead arquivado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao arquivar lead:", error);
      toast.error("Erro ao arquivar lead. Tente novamente.");
      return false;
    }
  };

  const handleUnarchiveLead = async (lead: Lead) => {
    try {
      const updatedLead = {
        ...lead,
        isArchived: false,
        history: [
          ...lead.history,
          {
            action: "unarchived",
            timestamp: new Date().toISOString(),
            from: null,
            to: null
          }
        ]
      };
      
      await updateLead(updatedLead);
      toast.success("Lead restaurado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao restaurar lead:", error);
      toast.error("Erro ao restaurar lead. Tente novamente.");
      return false;
    }
  };

  const convertToContact = async (lead: Lead) => {
    try {
      // Archive the lead after conversion
      const updatedLead = {
        ...lead,
        isArchived: true,
        history: [
          ...lead.history,
          {
            action: "converted",
            timestamp: new Date().toISOString(),
            from: null,
            to: null
          }
        ]
      };
      
      await updateLead(updatedLead);
      return true;
    } catch (error) {
      console.error("Erro ao converter para contato:", error);
      toast.error("Erro ao converter para contato. Tente novamente.");
      return false;
    }
  };

  const handleResetLeads = async () => {
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

  return {
    leads,
    loading,
    handleAddNewLead,
    handleMoveLead,
    handleUpdateLead,
    handleDeleteLead,
    handleArchiveLead,
    handleUnarchiveLead,
    convertToContact,
    handleResetLeads
  };
}
