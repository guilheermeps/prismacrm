
import { Lead, Stage } from './types';

// Cache local para links de registro - será usado quando estamos em modo offline
export const mockClientLinks: Record<string, any> = {};

// Funções para criar dados mockados
export const mockLeads = (): Lead[] => {
  return [
    {
      id: '1',
      name: 'João Silva',
      serviceType: 'Casamento',
      whatsapp: '11987654321',
      stageId: 'stage1',
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
      id: '2',
      name: 'Maria Oliveira',
      serviceType: 'Ensaio',
      whatsapp: '11912345678',
      stageId: 'stage2',
      proposalValue: 1200,
      notes: 'Ensaio pré-wedding',
      createdAt: new Date().toISOString(),
      isArchived: false,
      history: [
        {
          action: 'moved',
          timestamp: new Date().toISOString(),
          from: 'Contato Inicial',
          to: 'Proposta Enviada'
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
      color: '#3498db'
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
      title: 'Fechado',
      color: '#2ecc71'
    }
  ];
};
