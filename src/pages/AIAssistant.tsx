
import React from 'react';
import { Layout } from "@/components/layout/Layout";
import AIAssistant from '@/components/ai/AIAssistant';

const AIAssistantPage = () => {
  return (
    <Layout>
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Assistente de IA</h1>
          
          <div className="mb-6">
            <p className="text-muted-foreground">
              Use este assistente de IA para obter insights sobre seus leads, clientes, e vendas. 
              Você pode fazer perguntas, solicitar análises ou pedir sugestões baseadas nos seus dados.
            </p>
          </div>
          
          <AIAssistant 
            systemPrompt="Você é um assistente CRM inteligente especializado em vendas e gestão de leads. 
            Ajude o usuário a entender melhor seus clientes, otimizar o pipeline de vendas e melhorar as taxas de conversão.
            Forneça respostas concisas, práticas e orientadas a resultados."
          />
          
        </div>
      </main>
    </Layout>
  );
};

export default AIAssistantPage;
