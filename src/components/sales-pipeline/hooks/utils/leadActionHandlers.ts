
import { toast } from "sonner";
import { 
  createLead, 
  updateLead, 
  deleteLead
} from "@/lib/supabase/leadsService";
import { Lead } from "@/lib/supabase/types";
import { createContact, getContactByLeadId } from "@/lib/supabase/contactsService";
import { addHistoryEntry } from "./leadHistoryUtils";

// Add a new lead to the database
export const addNewLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'history' | 'isArchived'>): Promise<boolean> => {
  try {
    // Set defaults for new lead
    const newLead = {
      ...leadData,
      history: [],
      isArchived: false
    };
    
    console.log("Creating new lead with data:", newLead);
    const createdLead = await createLead(newLead);
    
    if (createdLead) {
      toast.success("Lead adicionado com sucesso!");
      return true;
    } else {
      toast.error("Erro ao adicionar lead. Tente novamente.");
      return false;
    }
  } catch (error) {
    console.error("Error in addNewLead:", error);
    toast.error("Erro ao adicionar lead. Tente novamente.");
    return false;
  }
};

// Move a lead to another stage
export const moveLead = async (lead: Lead, toStageId: string): Promise<boolean> => {
  try {
    console.log(`Moving lead ${lead.id} to stage ${toStageId}`);
    
    // Add movement to history
    const updatedLead = {
      ...lead,
      stageId: toStageId,
      history: addHistoryEntry(lead.history, "moved", lead.stageId, toStageId)
    };
    
    const result = await updateLead(updatedLead);
    
    if (result) {
      toast.success("Lead movido com sucesso!");
      return true;
    } else {
      toast.error("Erro ao mover lead. Tente novamente.");
      return false;
    }
  } catch (error) {
    console.error("Error in moveLead:", error);
    toast.error("Erro ao mover lead. Tente novamente.");
    return false;
  }
};

// Update a lead in the database
export const updateLeadData = async (leadData: Lead): Promise<boolean> => {
  try {
    console.log("Updating lead with data:", leadData);
    const updatedLead = await updateLead(leadData);
    
    if (updatedLead) {
      toast.success("Lead atualizado com sucesso!");
      return true;
    } else {
      toast.error("Erro ao atualizar lead. Tente novamente.");
      return false;
    }
  } catch (error) {
    console.error("Error in updateLeadData:", error);
    toast.error("Erro ao atualizar lead. Tente novamente.");
    return false;
  }
};

// Remove a lead from the database
export const removeLead = async (leadId: string): Promise<boolean> => {
  try {
    console.log("Deleting lead with ID:", leadId);
    const success = await deleteLead(leadId);
    
    if (success) {
      toast.success("Lead excluído com sucesso!");
      return true;
    } else {
      toast.error("Erro ao excluir lead. Tente novamente.");
      return false;
    }
  } catch (error) {
    console.error("Error in removeLead:", error);
    toast.error("Erro ao excluir lead. Tente novamente.");
    return false;
  }
};

// Archive a lead
export const archiveLead = async (lead: Lead): Promise<boolean> => {
  try {
    console.log("Archiving lead:", lead);
    
    // Add history entry and update isArchived flag
    const updatedLead = {
      ...lead,
      isArchived: true,
      history: addHistoryEntry(lead.history, "archived", null, null)
    };
    
    const result = await updateLead(updatedLead);
    
    if (result) {
      toast.success("Lead arquivado com sucesso!");
      return true;
    } else {
      toast.error("Erro ao arquivar lead. Tente novamente.");
      return false;
    }
  } catch (error) {
    console.error("Error in archiveLead:", error);
    toast.error("Erro ao arquivar lead. Tente novamente.");
    return false;
  }
};

// Unarchive a lead
export const unarchiveLead = async (lead: Lead): Promise<boolean> => {
  try {
    console.log("Unarchiving lead:", lead);
    
    // Add history entry and update isArchived flag
    const updatedLead = {
      ...lead,
      isArchived: false,
      history: addHistoryEntry(lead.history, "unarchived", null, null)
    };
    
    const result = await updateLead(updatedLead);
    
    if (result) {
      toast.success("Lead restaurado com sucesso!");
      return true;
    } else {
      toast.error("Erro ao restaurar lead. Tente novamente.");
      return false;
    }
  } catch (error) {
    console.error("Error in unarchiveLead:", error);
    toast.error("Erro ao restaurar lead. Tente novamente.");
    return false;
  }
};

// Discard a lead
export const discardLead = async (lead: Lead): Promise<boolean> => {
  try {
    console.log("Discarding lead:", lead);
    
    // Find the "Lost" stage or similar
    // This is a simplified version, in a real app you'd get the actual stage ID
    const lostStageId = "lost"; // Example ID
    
    // Add history entry and update stageId
    const updatedLead = {
      ...lead,
      stageId: lostStageId,
      history: addHistoryEntry(lead.history, "discarded", lead.stageId, lostStageId)
    };
    
    const result = await updateLead(updatedLead);
    
    if (result) {
      toast.success("Lead descartado com sucesso!");
      return true;
    } else {
      toast.error("Erro ao descartar lead. Tente novamente.");
      return false;
    }
  } catch (error) {
    console.error("Error in discardLead:", error);
    toast.error("Erro ao descartar lead. Tente novamente.");
    return false;
  }
};

// Convert a lead to a contact
export const convertLeadToContact = async (lead: Lead): Promise<boolean> => {
  try {
    console.log("Converting lead to contact:", lead);
    
    // Check if a contact already exists for this lead
    const existingContact = await getContactByLeadId(lead.id);
    
    if (existingContact) {
      console.log("Contact already exists for this lead:", existingContact);
      toast.info("Este lead já foi convertido para contato!");
      return true;
    }
    
    // Create contact from lead data
    const contactData = {
      name: lead.name,
      phone: lead.whatsapp,
      whatsapp: lead.whatsapp,
      is_active: true,
      lead_id: lead.id,
      tags: [{ id: uuidv4(), name: "Cliente", color: "#4caf50" }]
    };
    
    const contactId = await createContact(contactData);
    
    if (!contactId) {
      toast.error("Erro ao converter lead para contato. Tente novamente.");
      return false;
    }
    
    // Update lead with history entry
    const updatedLead = {
      ...lead,
      history: addHistoryEntry(lead.history, "converted", null, null)
    };
    
    const result = await updateLead(updatedLead);
    
    if (result) {
      toast.success("Lead convertido para contato com sucesso!");
      return true;
    } else {
      toast.error("Erro ao atualizar histórico do lead. O contato foi criado, mas o histórico não foi atualizado.");
      return true; // Still return true since the contact was created
    }
  } catch (error) {
    console.error("Error in convertLeadToContact:", error);
    toast.error("Erro ao converter lead para contato. Tente novamente.");
    return false;
  }
};

// Helper function for generating UUIDs
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
