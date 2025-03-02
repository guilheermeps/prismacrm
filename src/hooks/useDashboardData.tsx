
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  getDashboardStats, 
  getLeadsBySource, 
  getLeadsByService, 
  getMonthlyRevenue,
  getSalesGoal,
  getUpcomingPayments,
  getUpcomingSchedule
} from '@/lib/supabase/dashboardService';

export function useDashboardData() {
  // Estatísticas gerais
  const { 
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Leads por fonte
  const {
    data: leadSources = [],
    isLoading: leadSourcesLoading,
  } = useQuery({
    queryKey: ['leadSources'],
    queryFn: getLeadsBySource,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  // Leads por tipo de serviço
  const {
    data: serviceTypes = [],
    isLoading: serviceTypesLoading,
  } = useQuery({
    queryKey: ['serviceTypes'],
    queryFn: getLeadsByService,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  // Receita mensal
  const {
    data: monthlyRevenue = [],
    isLoading: revenueLoading,
  } = useQuery({
    queryKey: ['monthlyRevenue'],
    queryFn: getMonthlyRevenue,
    staleTime: 15 * 60 * 1000, // 15 minutos
  });

  // Meta de vendas
  const {
    data: monthlyGoal,
    isLoading: goalLoading,
  } = useQuery({
    queryKey: ['salesGoal'],
    queryFn: getSalesGoal,
    staleTime: 60 * 60 * 1000, // 1 hora
  });

  // Pagamentos próximos
  const {
    data: upcomingPayments = [],
    isLoading: paymentsLoading,
  } = useQuery({
    queryKey: ['upcomingPayments'],
    queryFn: getUpcomingPayments,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Agenda próxima
  const {
    data: upcomingSchedule = [],
    isLoading: scheduleLoading,
  } = useQuery({
    queryKey: ['upcomingSchedule'],
    queryFn: getUpcomingSchedule,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Estado derivado para negociações
  const negotiations = {
    total: stats?.negotiationsTotal || 0,
    currency: 'R$',
    count: stats?.negotiationsCount || 0
  };

  // Estado derivado para taxa de conversão
  const conversionRate = stats?.conversionRate || 0;

  // Objeto com todos os dados e estados de loading
  return {
    leadSources,
    serviceTypes,
    monthlyRevenue,
    monthlyGoal,
    negotiations,
    conversionRate,
    upcomingPayments,
    upcomingSchedule,
    isLoading: 
      statsLoading || 
      leadSourcesLoading || 
      serviceTypesLoading || 
      revenueLoading || 
      goalLoading || 
      paymentsLoading || 
      scheduleLoading,
    refetchData: refetchStats
  };
}
