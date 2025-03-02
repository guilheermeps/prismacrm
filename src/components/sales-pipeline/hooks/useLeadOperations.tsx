
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
  convertLeadToContact,
  discardLead
} from "./utils/leadActionHandlers";
import { resetAllLeads } from "./utils/leadBulkOperations";

export function useLeadOperations() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        setLoading(true);
        console.log("Fetching leads from database...");
        const leadsData = await getLeads();
        console.log("Leads loaded:", leadsData.length);
        setLeads(leadsData);
      } catch (error) {
        console.error("Erro ao carregar leads:", error);
        toast.error("Erro ao carregar leads. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    
    loadLeads();
    
    // Set up real-time subscription for changes
    const leadsSubscription = supabase
      .channel('leads-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'leads' 
      }, (payload) => {
        console.log("Lead change detected:", payload);
        // Reload the leads to reflect the changes
        loadLeads();
      })
      .subscribe();
    
    // Clean up subscriptions on unmount
    return () => {
      console.log("Cleaning up Supabase subscriptions");
      leadsSubscription.unsubscribe();
    };
  }, []);

  const handleAddNewLead = async (newLead: Omit<Lead, 'id' | 'createdAt' | 'history' | 'isArchived'>) => {
    const result = await addNewLead(newLead);
    if (result) {
      // Success already handled in addNewLead with toast
      console.log("Lead added successfully");
    }
    return result;
  };

  const handleMoveLead = async (leadId: string, fromStageId: string, toStageId: string) => {
    console.log(`Moving lead ${leadId} from ${fromStageId} to ${toStageId}`);
    const lead = leads.find(l => l.id === leadId);
    
    if (!lead) {
      console.error("Cannot move lead: Lead not found");
      toast.error("Erro ao mover lead: Lead não encontrado");
      return false;
    }
    
    return await moveLead(lead, toStageId);
  };

  const handleUpdateLead = async (updatedLead: Lead) => {
    console.log("Updating lead:", updatedLead.id);
    return await updateLeadData(updatedLead);
  };

  const handleDeleteLead = async (leadId: string) => {
    console.log("Deleting lead:", leadId);
    return await removeLead(leadId);
  };

  const handleArchiveLead = async (lead: Lead) => {
    console.log("Archiving lead:", lead.id);
    return await archiveLead(lead);
  };

  const handleUnarchiveLead = async (lead: Lead) => {
    console.log("Unarchiving lead:", lead.id);
    return await unarchiveLead(lead);
  };

  const handleDiscardLead = async (lead: Lead) => {
    console.log("Discarding lead:", lead.id);
    return await discardLead(lead);
  };

  const convertToContact = async (lead: Lead) => {
    console.log("Converting lead to contact:", lead.id);
    return await convertLeadToContact(lead);
  };

  const handleResetLeads = async () => {
    console.log("Resetting all leads");
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
    handleDiscardLead,
    convertToContact,
    handleResetLeads
  };
}
