
export const monthlyGoal = {
  current: 67,
  target: 100,
  month: 'Janeiro'
};

export const negotiations = {
  total: 10450,
  currency: 'R$',
  count: 5
};

export const leadSources = [
  { name: 'Instagram', value: 45 },
  { name: 'Indicação', value: 30 },
  { name: 'Website', value: 15 },
  { name: 'Facebook', value: 10 }
];

export const conversionRate = 52;

export const serviceTypes = [
  { name: 'Casamento', value: 35 },
  { name: 'Gestante', value: 25 },
  { name: '15 anos', value: 15 },
  { name: 'Formatura', value: 25 }
];

export const upcomingPayments = [
  { id: 1, client: 'Ana Carolina', service: 'Casamento', amount: 3500, dueDate: '2024-05-15', status: 'pending' },
  { id: 2, client: 'Marcos Silva', service: 'Formatura', amount: 1200, dueDate: '2024-05-10', status: 'pending' },
  { id: 3, client: 'Juliana Santos', service: 'Gestante', amount: 850, dueDate: '2024-05-05', status: 'completed' },
  { id: 4, client: 'Pedro Oliveira', service: '15 anos', amount: 2200, dueDate: '2024-05-20', status: 'pending' },
  { id: 5, client: 'Carla Mendes', service: 'Casamento', amount: 4000, dueDate: '2024-05-30', status: 'pending' }
];

export const upcomingSchedule = [
  { id: 1, client: 'Ana Carolina', service: 'Casamento', date: '2024-05-20', time: '15:00', location: 'Jardim Botânico' },
  { id: 2, client: 'Marcos Silva', service: 'Formatura', date: '2024-05-15', time: '19:00', location: 'Universidade Federal' },
  { id: 3, client: 'Juliana Santos', service: 'Gestante', date: '2024-05-10', time: '10:00', location: 'Estúdio' },
  { id: 4, client: 'Pedro Oliveira', service: '15 anos', date: '2024-05-25', time: '16:00', location: 'Buffet Estrela' },
  { id: 5, client: 'Carla Mendes', service: 'Casamento', date: '2024-06-01', time: '17:00', location: 'Sítio Santa Luz' }
];

export const monthlyRevenue = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Fev', revenue: 15000 },
  { month: 'Mar', revenue: 18000 },
  { month: 'Abr', revenue: 14000 },
  { month: 'Mai', revenue: 16000 },
  { month: 'Jun', revenue: 20000 },
  { month: 'Jul', revenue: 22000 },
  { month: 'Ago', revenue: 19000 },
  { month: 'Set', revenue: 21000 },
  { month: 'Out', revenue: 23000 },
  { month: 'Nov', revenue: 25000 },
  { month: 'Dez', revenue: 28000 }
];

export const userProfile = {
  name: 'Guilherme',
  fullName: 'Guilherme Porto',
  handle: '@estudio.express',
  avatar: '/lovable-uploads/d680b836-23e6-40d8-927d-6ab0cb985bdd.png'
};

export const notifications = [
  { id: 1, message: 'Novo lead recebido', time: '2h atrás', read: false },
  { id: 2, message: 'Pagamento confirmado - Ana Carolina', time: '5h atrás', read: true },
  { id: 3, message: 'Sessão amanhã - Pedro Oliveira', time: '1d atrás', read: true }
];
