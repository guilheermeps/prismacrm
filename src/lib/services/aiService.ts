
import { supabase } from '@/lib/supabase/client';

export interface AIRequestOptions {
  prompt: string;
  systemPrompt?: string;
}

export interface AIResponse {
  response?: string;
  error?: string;
  details?: string;
}

export const generateAIResponse = async (options: AIRequestOptions): Promise<AIResponse> => {
  try {
    const { prompt, systemPrompt } = options;
    
    const { data, error } = await supabase.functions.invoke('generate-ai-response', {
      body: { prompt, systemPrompt },
    });

    if (error) {
      console.error('Error calling AI function:', error);
      return { error: 'Falha ao chamar o serviço de IA', details: error.message };
    }

    return data as AIResponse;
  } catch (error) {
    console.error('Error in AI service:', error);
    return { 
      error: 'Erro no serviço de IA', 
      details: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
};
