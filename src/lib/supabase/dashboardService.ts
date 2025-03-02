
import { supabase } from "../supabase/client";
import { monthlyRevenue as mockMonthlyRevenue, leadSources as mockLeadSources, serviceTypes as mockServiceTypes } from "../mockData";
import { format, subMonths } from 'date-fns';

// Estatísticas gerais do dashboard
export async function getDashboardStats() {
  try {
    // Obter o usuário atual
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const userId = session.user.id;

    // Buscar contagem de leads ativos
    const { count: leadsCount, error: leadsError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('isarchived', false);

    if (leadsError) console.error("Erro ao buscar leads:", leadsError);

    // Buscar contagem de clientes
    const { count: clientsCount, error: clientsError } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (clientsError) console.error("Erro ao buscar clientes:", clientsError);

    // Buscar soma total de contratos ativos
    const { data: contracts, error: contractsError } = await supabase
      .from('contracts')
      .select('total_amount')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (contractsError) console.error("Erro ao buscar contratos:", contractsError);

    const contractsTotal = contracts?.reduce((sum, contract) => sum + Number(contract.total_amount), 0) || 0;

    // Buscar propostas em negociação
    const { data: negotiations, error: negotiationsError } = await supabase
      .from('leads')
      .select('proposalvalue')
      .eq('user_id', userId)
      .eq('isarchived', false)
      .gt('proposalvalue', 0);

    if (negotiationsError) console.error("Erro ao buscar negociações:", negotiationsError);

    const negotiationsTotal = negotiations?.reduce((sum, lead) => sum + Number(lead.proposalvalue), 0) || 0;
    const negotiationsCount = negotiations?.length || 0;

    // Calcular taxa de conversão
    const { data: convertedLeads, error: convertedError } = await supabase
      .from('leads')
      .select('id')
      .eq('user_id', userId)
      .contains('history', [{ action: 'converted' }]);

    if (convertedError) console.error("Erro ao buscar leads convertidos:", convertedError);

    const conversionRate = leadsCount > 0 ? Math.round((convertedLeads?.length || 0) / leadsCount * 100) : 0;

    return {
      leadsCount: leadsCount || 0,
      clientsCount: clientsCount || 0,
      contractsTotal,
      negotiationsTotal,
      negotiationsCount,
      conversionRate
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error);
    return null;
  }
}

// Buscar distribuição de leads por fonte
export async function getLeadsBySource() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return mockLeadSources;

    const userId = session.user.id;

    // Mapear leads por origem (assumindo que temos um campo de origem no histórico)
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error("Erro ao buscar leads por fonte:", error);
      return mockLeadSources;
    }

    // Contar leads por tipo de serviço
    const sources = {
      Instagram: 0,
      Indicação: 0,
      Website: 0,
      Facebook: 0,
      Outro: 0
    };

    // Neste exemplo, estamos usando o campo "notes" como fonte
    // Em uma implementação real, você teria um campo específico para a fonte
    leads.forEach(lead => {
      const notes = lead.notes?.toLowerCase() || '';
      
      if (notes.includes('instagram')) sources.Instagram++;
      else if (notes.includes('indicação') || notes.includes('indicacao')) sources.Indicação++;
      else if (notes.includes('website') || notes.includes('site')) sources.Website++;
      else if (notes.includes('facebook')) sources.Facebook++;
      else sources.Outro++;
    });

    return [
      { name: 'Instagram', value: sources.Instagram },
      { name: 'Indicação', value: sources.Indicação },
      { name: 'Website', value: sources.Website },
      { name: 'Facebook', value: sources.Facebook },
      { name: 'Outro', value: sources.Outro }
    ];
  } catch (error) {
    console.error("Erro ao buscar leads por fonte:", error);
    return mockLeadSources;
  }
}

// Buscar leads por tipo de serviço
export async function getLeadsByService() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return mockServiceTypes;

    const userId = session.user.id;

    // Buscar tipos de serviço
    const { data: serviceTypesData, error: serviceTypesError } = await supabase
      .from('service_types')
      .select('id, name')
      .eq('user_id', userId);

    if (serviceTypesError) {
      console.error("Erro ao buscar tipos de serviço:", serviceTypesError);
      return mockServiceTypes;
    }

    // Buscar leads
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('servicetype')
      .eq('user_id', userId);

    if (leadsError) {
      console.error("Erro ao buscar leads:", leadsError);
      return mockServiceTypes;
    }

    // Mapear contagem por tipo de serviço
    const serviceTypeMap: Record<string, number> = {};
    
    // Inicializar contagem para cada tipo de serviço
    serviceTypesData.forEach(type => {
      serviceTypeMap[type.name] = 0;
    });

    // Contar leads por tipo de serviço
    leads.forEach(lead => {
      if (lead.servicetype && serviceTypeMap[lead.servicetype] !== undefined) {
        serviceTypeMap[lead.servicetype]++;
      }
    });

    // Transformar em array para o gráfico
    return Object.entries(serviceTypeMap).map(([name, value]) => ({
      name,
      value
    }));
  } catch (error) {
    console.error("Erro ao buscar leads por serviço:", error);
    return mockServiceTypes;
  }
}

// Buscar receita mensal
export async function getMonthlyRevenue() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return mockMonthlyRevenue;

    const userId = session.user.id;
    
    // Definir intervalo dos últimos 12 meses
    const endDate = new Date();
    const startDate = subMonths(endDate, 11); // 12 meses incluindo o atual
    
    // Buscar transações financeiras recebíveis
    const { data: transactions, error } = await supabase
      .from('financial_transactions')
      .select('amount, due_date')
      .eq('user_id', userId)
      .eq('type', 'receivable')
      .eq('status', 'completed')
      .gte('due_date', startDate.toISOString().split('T')[0]);
      
    if (error) {
      console.error("Erro ao buscar receita mensal:", error);
      return mockMonthlyRevenue;
    }
    
    // Inicializar array de receita mensal
    const monthlyRevenueMap: Record<string, number> = {};
    
    // Configurar meses no mapa
    for (let i = 0; i < 12; i++) {
      const date = subMonths(endDate, i);
      const monthKey = format(date, 'MMM');
      monthlyRevenueMap[monthKey] = 0;
    }
    
    // Somar transações por mês
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.due_date);
      const monthKey = format(transactionDate, 'MMM');
      
      if (monthlyRevenueMap[monthKey] !== undefined) {
        monthlyRevenueMap[monthKey] += Number(transaction.amount);
      }
    });
    
    // Transformar em array para o gráfico
    return Object.entries(monthlyRevenueMap).map(([month, revenue]) => ({
      month,
      revenue
    }));
  } catch (error) {
    console.error("Erro ao buscar receita mensal:", error);
    return mockMonthlyRevenue;
  }
}

// Buscar meta de vendas
export async function getSalesGoal() {
  // Em uma implementação real, você buscaria a meta do banco de dados
  // Por enquanto, vamos retornar um valor fixo
  return {
    current: 75000,
    target: 100000,
    month: format(new Date(), 'MMMM')
  };
}

// Buscar pagamentos próximos
export async function getUpcomingPayments() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const userId = session.user.id;
    
    // Buscar transações com vencimento próximo
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('id, client, amount, due_date, status')
      .eq('user_id', userId)
      .eq('type', 'receivable')
      .eq('status', 'pending')
      .gte('due_date', today.toISOString().split('T')[0])
      .lte('due_date', nextMonth.toISOString().split('T')[0])
      .order('due_date', { ascending: true })
      .limit(5);
      
    if (error) {
      console.error("Erro ao buscar pagamentos próximos:", error);
      return [];
    }
    
    return data.map(payment => ({
      id: payment.id,
      client: payment.client,
      value: payment.amount,
      dueDate: payment.due_date,
      status: payment.status
    }));
  } catch (error) {
    console.error("Erro ao buscar pagamentos próximos:", error);
    return [];
  }
}

// Buscar agenda próxima
export async function getUpcomingSchedule() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const userId = session.user.id;
    
    const { data, error } = await supabase
      .from('schedule_events')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true })
      .limit(5);
      
    if (error) {
      console.error("Erro ao buscar agenda próxima:", error);
      return [];
    }
    
    return data.map(event => ({
      id: event.id,
      client: event.client,
      service: event.service,
      date: event.date,
      time: event.time,
      location: event.location
    }));
  } catch (error) {
    console.error("Erro ao buscar agenda próxima:", error);
    return [];
  }
}
