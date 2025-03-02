
import { supabase } from './client';
import { Stage } from './types';
import { mockStages } from './mockData';

export const getStages = async (): Promise<Stage[]> => {
  try {
    const { data, error } = await supabase.from('stages').select('*');
    
    if (error) {
      console.warn('Usando dados simulados para estágios:', error.message);
      return mockStages();
    }
    
    return data || [];
  } catch (e) {
    console.warn('Usando dados simulados para estágios devido a erro:', e);
    return mockStages();
  }
};

export const createStage = async (stage: Omit<Stage, 'id'>): Promise<Stage | null> => {
  const { data, error } = await supabase
    .from('stages')
    .insert(stage)
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao criar estágio:', error);
    
    // In demo/development mode, simulate success with mock data
    if (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true') {
      const mockId = Math.random().toString(36).substring(2, 15);
      const mockStage = {
        id: mockId,
        ...stage,
      };
      console.log('Created mock stage in development mode:', mockStage);
      return mockStage;
    }
    
    return null;
  }
  
  return data;
};

export const updateStage = async (stage: Stage): Promise<Stage | null> => {
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
  
  return data;
};

export const deleteStage = async (id: string): Promise<boolean> => {
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
  
  return true;
};
