
import { supabase } from '../client';

export interface ServiceType {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  user_id: string;
  created_at: string;
}

// Get all service types for the current user
export const getServiceTypes = async (): Promise<ServiceType[]> => {
  try {
    const { data, error } = await supabase
      .from('service_types')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching service types:', error.message);
      return [];
    }
    
    return data || [];
  } catch (e) {
    console.error('Exception while fetching service types:', e);
    return [];
  }
};

// Create a service type
export const createServiceType = async (serviceType: Omit<ServiceType, 'id' | 'created_at'>): Promise<ServiceType | null> => {
  try {
    const { data, error } = await supabase
      .from('service_types')
      .insert(serviceType)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating service type:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception while creating service type:', error);
    return null;
  }
};

// Update a service type
export const updateServiceType = async (serviceType: Partial<ServiceType> & { id: string }): Promise<ServiceType | null> => {
  try {
    const { data, error } = await supabase
      .from('service_types')
      .update(serviceType)
      .eq('id', serviceType.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating service type:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception while updating service type:', error);
    return null;
  }
};

// Delete a service type
export const deleteServiceType = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('service_types')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting service type:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception while deleting service type:', error);
    return false;
  }
};
