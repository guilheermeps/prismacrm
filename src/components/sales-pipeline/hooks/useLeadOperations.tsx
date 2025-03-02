
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  supabase, 
  getLeads,
  type Lead
} from "@/lib/supabase";
import { 
  addNewLead, 
  moveLead,
  updateLeadData,
  removeLead,
  archiveLead,
  unarchiveLead,
  convertLeadToContact
} from "./utils/leadActionHandlers";
import { resetAllLeads } from "./utils/leadBulkOperations";

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
    return await addNewLead(newLead);
  };

  const handleMoveLead = async (leadId: string, fromStageId: string, toStageId: string) => {
    const lead = leads.find(l => l.id === leadId);
    return await moveLead(lead, toStageId);
  };

  const handleUpdateLead = async (updatedLead: Lead) => {
    return await updateLeadData(updatedLead);
  };

  const handleDeleteLead = async (leadId: string) => {
    return await removeLead(leadId);
  };

  const handleArchiveLead = async (lead: Lead) => {
    return await archiveLead(lead);
  };

  const handleUnarchiveLead = async (lead: Lead) => {
    return await unarchiveLead(lead);
  };

  const convertToContact = async (lead: Lead) => {
    return await convertLeadToContact(lead);
  };

  const handleResetLeads = async () => {
    return await resetAllLeads();
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
