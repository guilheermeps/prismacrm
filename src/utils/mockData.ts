
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
  { 
    id: 1, 
    client: 'Ana Carolina', 
    service: 'Casamento', 
    amount: 3500, 
    dueDate: '2024-05-15', 
    status: 'pending',
    type: 'receivable' // contas a receber
  },
  { 
    id: 2, 
    client: 'Marcos Silva', 
    service: 'Formatura', 
    amount: 1200, 
    dueDate: '2024-05-10', 
    status: 'pending',
    type: 'receivable'
  },
  { 
    id: 3, 
    client: 'Juliana Santos', 
    service: 'Gestante', 
    amount: 850, 
    dueDate: '2024-05-05', 
    status: 'completed',
    type: 'receivable'
  },
  { 
    id: 4, 
    client: 'Pedro Oliveira', 
    service: '15 anos', 
    amount: 2200, 
    dueDate: '2024-05-20', 
    status: 'pending',
    type: 'receivable'
  },
  { 
    id: 5, 
    client: 'Carla Mendes', 
    service: 'Casamento', 
    amount: 4000, 
    dueDate: '2024-05-30', 
    status: 'pending',
    type: 'receivable'
  },
  { 
    id: 6, 
    client: 'Aluguel Estúdio', 
    service: 'Despesa Fixa', 
    amount: 1500, 
    dueDate: '2024-05-10', 
    status: 'pending',
    type: 'payable' // contas a pagar
  },
  { 
    id: 7, 
    client: 'Fornecedor Álbuns', 
    service: 'Material', 
    amount: 850, 
    dueDate: '2024-05-15', 
    status: 'completed',
    type: 'payable'
  },
  { 
    id: 8, 
    client: 'Energia Elétrica', 
    service: 'Despesa Fixa', 
    amount: 320, 
    dueDate: '2024-05-22', 
    status: 'pending',
    type: 'payable'
  }
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

// Contatos fictícios para a interface
export const mockContacts = [
  {
    id: 1,
    name: "Maria Silva",
    email: "maria.silva@email.com",
    phone: "(11) 98765-4321",
    type: "client",
    document: "123.456.789-00",
    identity: "12.345.678-9",
    street: "Rua das Flores",
    number: "123",
    complement: "Apto 101",
    neighborhood: "Jardim Primavera",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    notes: "Cliente desde 2022. Prefere ser contatada por WhatsApp.",
    orders: [
      { id: 1001, date: "15/03/2023", type: "Ensaio", value: 800, status: "completed" },
      { id: 1045, date: "22/10/2023", type: "Casamento", value: 3500, status: "completed" }
    ]
  },
  {
    id: 2,
    name: "João Oliveira",
    email: "joao.oliveira@email.com",
    phone: "(11) 91234-5678",
    type: "client",
    document: "987.654.321-00",
    identity: "98.765.432-1",
    street: "Avenida Central",
    number: "456",
    complement: "",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "04567-890",
    notes: "Cliente corporativo. Faz pedidos semestrais para eventos da empresa.",
    orders: [
      { id: 1023, date: "05/06/2023", type: "Evento Corporativo", value: 2500, status: "completed" },
      { id: 1067, date: "10/12/2023", type: "Evento Corporativo", value: 2800, status: "completed" },
      { id: 1089, date: "15/05/2024", type: "Evento Corporativo", value: 3000, status: "in-progress" }
    ]
  },
  {
    id: 3,
    name: "Álbuns Express",
    email: "contato@albunsexpress.com.br",
    phone: "(11) 3456-7890",
    type: "supplier",
    document: "12.345.678/0001-90",
    identity: "123.456.789",
    street: "Rua da Indústria",
    number: "789",
    complement: "Galpão 3",
    neighborhood: "Distrito Industrial",
    city: "Guarulhos",
    state: "SP",
    zipCode: "07890-123",
    notes: "Fornecedor de álbuns fotográficos. Pedido mínimo de 5 unidades. Prazo de entrega: 15 dias úteis.",
    orders: []
  },
  {
    id: 4,
    name: "Ana Carolina Santos",
    email: "ana.carolina@email.com",
    phone: "(11) 95555-9999",
    type: "client",
    document: "111.222.333-44",
    identity: "11.222.333-4",
    street: "Rua das Palmeiras",
    number: "321",
    complement: "Casa",
    neighborhood: "Jardim Europa",
    city: "São Paulo",
    state: "SP",
    zipCode: "05678-901",
    notes: "Noiva. Casamento marcado para dezembro de 2024.",
    orders: [
      { id: 1099, date: "10/04/2024", type: "Ensaio Pré-Wedding", value: 1200, status: "pending" }
    ]
  },
  {
    id: 5,
    name: "Gráfica Moderna",
    email: "vendas@graficamoderna.com.br",
    phone: "(11) 2345-6789",
    type: "supplier",
    document: "98.765.432/0001-10",
    identity: "987.654.321",
    street: "Avenida Comercial",
    number: "1000",
    complement: "Sala 15",
    neighborhood: "Brás",
    city: "São Paulo",
    state: "SP",
    zipCode: "03456-789",
    notes: "Fornecedor de impressões especiais e materiais gráficos.",
    orders: []
  }
];
