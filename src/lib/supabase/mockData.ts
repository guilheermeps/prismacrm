
import { Lead, Stage } from './types';

// Cache local para links de registro - será usado quando estamos em modo offline
export const mockClientLinks: Record<string, any> = {};

// Funções para criar dados mockados
export const mockLeads = (): Lead[] => {
  const stages = mockStages();
  
  return [
    {
      id: crypto.randomUUID(),
      name: 'João Silva',
      serviceType: 'Casamento',
      whatsapp: '11987654321',
      stageId: stages[0].id,
      proposalValue: 3500,
      notes: 'Cliente interessado em pacote completo',
      createdAt: new Date().toISOString(),
      isArchived: false,
      history: [
        {
          action: 'created',
          timestamp: new Date().toISOString(),
          from: null,
          to: 'Contato Inicial'
        }
      ]
    },
    {
      id: crypto.randomUUID(),
      name: 'Maria Oliveira',
      serviceType: 'Ensaio Fotográfico',
      whatsapp: '11912345678',
      stageId: stages[1].id,
      proposalValue: 1200,
      notes: 'Ensaio pré-wedding',
      createdAt: new Date().toISOString(),
      isArchived: false,
      history: [
        {
          action: 'created',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          from: null,
          to: 'Contato Inicial'
        },
        {
          action: 'moved',
          timestamp: new Date().toISOString(),
          from: 'Contato Inicial',
          to: 'Proposta Enviada'
        }
      ]
    },
    {
      id: crypto.randomUUID(),
      name: 'Pedro Santos',
      serviceType: 'Evento Corporativo',
      whatsapp: '11976543210',
      stageId: stages[2].id,
      proposalValue: 5000,
      notes: 'Evento para 100 pessoas, com coffee break',
      createdAt: new Date().toISOString(),
      isArchived: false,
      history: [
        {
          action: 'created',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          from: null,
          to: 'Contato Inicial'
        },
        {
          action: 'moved',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          from: 'Contato Inicial',
          to: 'Proposta Enviada'
        },
        {
          action: 'moved',
          timestamp: new Date().toISOString(),
          from: 'Proposta Enviada',
          to: 'Negociação'
        }
      ]
    }
  ];
};

export const mockStages = (): Stage[] => {
  return [
    {
      id: 'stage1',
      title: 'Contato Inicial',
      color: '#4361ee'
    },
    {
      id: 'stage2',
      title: 'Proposta Enviada',
      color: '#f39c12'
    },
    {
      id: 'stage3',
      title: 'Negociação',
      color: '#9b59b6'
    },
    {
      id: 'stage4',
      title: 'Fechado (Ganho)',
      color: '#2ecc71'
    },
    {
      id: 'stage5',
      title: 'Fechado (Perdido)',
      color: '#e74c3c'
    }
  ];
};
