
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";

// Contact types
export interface ContactTag {
  id: string;
  name: string;
  color: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  lead_id?: string;
  tags: ContactTag[];
}

// Create a new contact
export const createContact = async (contactData: Omit<Contact, 'id' | 'created_at'>): Promise<string | null> => {
  try {
    const id = uuidv4();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Usuário não autenticado");
      return null;
    }
    
    // Convert contactData.tags to JSON-compatible format
    const dbContact = {
      id,
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      whatsapp: contactData.whatsapp,
      address: contactData.address,
      city: contactData.city,
      state: contactData.state,
      postal_code: contactData.postal_code,
      notes: contactData.notes,
      is_active: contactData.is_active,
      lead_id: contactData.lead_id,
      tags: contactData.tags as unknown as Json,
      user_id: user.id
    };
    
    const { error } = await supabase
      .from('contacts')
      .insert(dbContact);

    if (error) {
      console.error("Error creating contact:", error);
      toast.error("Erro ao criar contato");
      throw error;
    }

    toast.success("Contato criado com sucesso!");
    return id;
  } catch (error) {
    console.error("Error in createContact:", error);
    toast.error("Erro ao criar contato");
    return null;
  }
};

// Get all contacts
export const getContacts = async (): Promise<Contact[]> => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }

    // Convert the data from JSON to our Contact type
    const contacts = data.map(item => ({
      ...item,
      tags: item.tags as unknown as ContactTag[]
    })) as Contact[];

    return contacts;
  } catch (error) {
    console.error("Error in getContacts:", error);
    return [];
  }
};

// Get contact by ID
export const getContactById = async (id: string): Promise<Contact | null> => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching contact:", error);
      throw error;
    }

    if (!data) return null;

    // Convert the data from JSON to our Contact type
    const contact = {
      ...data,
      tags: data.tags as unknown as ContactTag[]
    } as Contact;

    return contact;
  } catch (error) {
    console.error("Error in getContactById:", error);
    return null;
  }
};

// Update a contact
export const updateContact = async (contact: Partial<Contact> & { id: string }): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Usuário não autenticado");
      return false;
    }
    
    // Prepare DB-compatible object
    const dbContact: any = { ...contact };
    if (contact.tags) {
      dbContact.tags = contact.tags as unknown as Json;
    }

    const { error } = await supabase
      .from('contacts')
      .update(dbContact)
      .eq('id', contact.id);

    if (error) {
      console.error("Error updating contact:", error);
      toast.error("Erro ao atualizar contato");
      throw error;
    }

    toast.success("Contato atualizado com sucesso!");
    return true;
  } catch (error) {
    console.error("Error in updateContact:", error);
    toast.error("Erro ao atualizar contato");
    return false;
  }
};

// Delete a contact
export const deleteContact = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting contact:", error);
      toast.error("Erro ao excluir contato");
      throw error;
    }

    toast.success("Contato excluído com sucesso");
    return true;
  } catch (error) {
    console.error("Error in deleteContact:", error);
    toast.error("Erro ao excluir contato");
    return false;
  }
};

// Get contacts by filter
export const getContactsByFilter = async (
  filter: {
    name?: string;
    is_active?: boolean;
    tag?: string;
  }
): Promise<Contact[]> => {
  try {
    let query = supabase
      .from('contacts')
      .select('*');

    if (filter.name) {
      query = query.ilike('name', `%${filter.name}%`);
    }

    if (filter.is_active !== undefined) {
      query = query.eq('is_active', filter.is_active);
    }

    if (filter.tag) {
      // Since tags are stored as JSONB, we need to check if the array contains the tag
      query = query.contains('tags', [{ name: filter.tag }]);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) {
      console.error("Error fetching filtered contacts:", error);
      throw error;
    }

    // Convert the data from JSON to our Contact type
    const contacts = data.map(item => ({
      ...item,
      tags: item.tags as unknown as ContactTag[]
    })) as Contact[];

    return contacts;
  } catch (error) {
    console.error("Error in getContactsByFilter:", error);
    return [];
  }
};

// Get contact by lead ID
export const getContactByLeadId = async (leadId: string): Promise<Contact | null> => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('lead_id', leadId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching contact by lead ID:", error);
      throw error;
    }

    if (!data) return null;

    // Convert the data from JSON to our Contact type
    const contact = {
      ...data,
      tags: data.tags as unknown as ContactTag[]
    } as Contact;

    return contact;
  } catch (error) {
    console.error("Error in getContactByLeadId:", error);
    return null;
  }
};
