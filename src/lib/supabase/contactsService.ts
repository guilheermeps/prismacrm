import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Json } from "@/integrations/supabase/types";

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
  lead_id?: string;
  tags?: any[];
  created_at: string;
}

// Get all contacts
export const getContacts = async (): Promise<Contact[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return [];
    }

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }

    return data as Contact[];
  } catch (error) {
    console.error("Error in getContacts:", error);
    return [];
  }
};

// Create a new contact
export const createContact = async (contactData: Omit<Contact, 'id' | 'created_at'>): Promise<string | null> => {
  try {
    const id = uuidv4();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return null;
    }
    
    const { error } = await supabase
      .from('contacts')
      .insert({
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
        tags: contactData.tags as Json,
        user_id: user.id
      });

    if (error) {
      console.error("Error creating contact:", error);
      throw error;
    }

    return id;
  } catch (error) {
    console.error("Error in createContact:", error);
    return null;
  }
};

// Get contact by ID
export const getContactById = async (id: string): Promise<Contact | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return null;
    }

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error("Error fetching contact:", error);
      throw error;
    }

    return data as Contact;
  } catch (error) {
    console.error("Error in getContactById:", error);
    return null;
  }
};

// Update a contact
export const updateContact = async (contact: Partial<Contact> & { id: string }): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return false;
    }

    const { error } = await supabase
      .from('contacts')
      .update(contact)
      .eq('id', contact.id)
      .eq('user_id', user.id);

    if (error) {
      console.error("Error updating contact:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in updateContact:", error);
    return false;
  }
};

// Delete a contact (soft delete)
export const deleteContact = async (id: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return false;
    }

    // Soft delete
    const { error } = await supabase
      .from('contacts')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteContact:", error);
    return false;
  }
};

// Search contacts
export const searchContacts = async (query: string): Promise<Contact[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return [];
    }

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('name', { ascending: true });

    if (error) {
      console.error("Error searching contacts:", error);
      throw error;
    }

    return data as Contact[];
  } catch (error) {
    console.error("Error in searchContacts:", error);
    return [];
  }
};
