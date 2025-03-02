
import { toast } from "sonner";
import { Lead } from "@/lib/supabase/types";
import { createContact } from "@/lib/supabase/contactsService";
import { deleteLead } from "@/lib/supabase/services/leadsCrudService";

// Function to convert a lead to a contact
export const convertLeadToContact = async (lead: Lead): Promise<boolean> => {
  try {
    // Create a new contact from the lead data
    const newContact = {
      name: lead.name,
      whatsapp: lead.whatsapp,
      leadId: lead.id,
      notes: lead.notes || "",
      is_active: true // Add the missing is_active property
    };
    
    await createContact(newContact);
    
    // Delete the lead after successfully creating a contact
    await deleteLead(lead.id);
    
    toast.success("Lead convertido para contato com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao converter lead em contato:", error);
    toast.error("Erro ao converter lead em contato");
    return false;
  }
};
