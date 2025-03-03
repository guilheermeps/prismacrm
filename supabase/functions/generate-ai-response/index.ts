
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, systemPrompt } = await req.json()

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Nenhum prompt fornecido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'API key não configurada',
          message: 'A chave da API OpenAI não foi configurada no servidor.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const defaultSystemPrompt = "Você é um assistente CRM inteligente para uma empresa de serviços. " +
      "Ajude os usuários com insights sobre seus clientes, leads e vendas. " +
      "Seja útil, profissional e forneça respostas concisas."

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt || defaultSystemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    
    if (data.error) {
      console.error('OpenAI API error:', data.error)
      return new Response(
        JSON.stringify({ error: 'Erro na API OpenAI', details: data.error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const aiResponse = data.choices[0].message.content

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-ai-response function:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
