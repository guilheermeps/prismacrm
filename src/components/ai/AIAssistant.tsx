
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generateAIResponse } from '@/lib/services/aiService';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AIAssistantProps {
  systemPrompt?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ systemPrompt }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Por favor, digite uma pergunta ou instrução');
      return;
    }
    
    setIsLoading(true);
    setResponse('');
    
    try {
      const result = await generateAIResponse({ prompt, systemPrompt });
      
      if (result.error) {
        toast.error(result.error);
        console.error('AI Error details:', result.details);
      } else if (result.response) {
        setResponse(result.response);
      }
    } catch (error) {
      toast.error('Erro ao processar sua solicitação');
      console.error('AI request error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Assistente IA</CardTitle>
        <CardDescription>
          Faça perguntas sobre seus dados, peça sugestões ou solicite análises
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Digite sua pergunta ou instrução... (Ex: Resuma os leads que temos atualmente)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-20"
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : 'Enviar'}
          </Button>
        </form>
        
        {response && (
          <div className="mt-6 p-4 bg-muted/50 rounded-md whitespace-pre-wrap">
            <h3 className="font-medium mb-2">Resposta:</h3>
            <div className="text-sm">{response}</div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        As respostas são geradas por IA e podem não ser 100% precisas.
      </CardFooter>
    </Card>
  );
};

export default AIAssistant;
