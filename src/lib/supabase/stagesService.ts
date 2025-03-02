
import { supabase } from './client';
import { Stage } from './types';
import { mockStages } from './mockData';

export const getStages = async (): Promise<Stage[]> => {
  try {
    console.log('Fetching stages from Supabase...');
    const { data, error } = await supabase.from('stages').select('*').order('title');
    
    if (error) {
      console.warn('Usando dados simulados para estágios:', error.message);
      return mockStages();
    }
    
    if (!data || data.length === 0) {
      console.log('No stages found in database, using mock data');
      return mockStages();
    }
    
    return data || [];
  } catch (e) {
    console.warn('Usando dados simulados para estágios devido a erro:', e);
    return mockStages();
  }
};

export const createStage = async (stage: Omit<Stage, 'id'>): Promise<Stage | null> => {
  try {
    console.log('Creating stage:', stage);
    const { data, error } = await supabase
      .from('stages')
      .insert(stage)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar estágio:', error);
      
      // In demo/development mode, simulate success with mock data
      if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
        const mockId = crypto.randomUUID();
        const mockStage = {
          id: mockId,
          ...stage,
        };
        console.log('Created mock stage in development mode:', mockStage);
        return mockStage;
      }
      
      return null;
    }
    
    console.log('Successfully created stage:', data);
    return data;
  } catch (error) {
    console.error('Exception while creating stage:', error);
    return null;
  }
};

export const updateStage = async (stage: Stage): Promise<Stage | null> => {
  try {
    console.log('Updating stage:', stage);
    const { data, error } = await supabase
      .from('stages')
      .update(stage)
      .eq('id', stage.id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar estágio:', error);
      
      // In demo/development mode, simulate success with mock data
      if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
        console.log('Updated mock stage in development mode:', stage);
        return stage;
      }
      
      return null;
    }
    
    console.log('Successfully updated stage:', data);
    return data;
  } catch (error) {
    console.error('Exception while updating stage:', error);
    return null;
  }
};

export const deleteStage = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting stage with ID:', id);
    const { error } = await supabase
      .from('stages')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao excluir estágio:', error);
      
      // In demo/development mode, simulate success
      if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
        console.log('Deleted mock stage in development mode, id:', id);
        return true;
      }
      
      return false;
    }
    
    console.log('Successfully deleted stage with ID:', id);
    return true;
  } catch (error) {
    console.error('Exception while deleting stage:', error);
    return false;
  }
};
