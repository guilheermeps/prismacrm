
// Re-export all lead-related functions
export { getLeads, createLead, updateLead, deleteLead } from './services/leadsCrudService';
export { formatWhatsAppNumber, getWhatsAppUrl } from './utils/whatsappUtils';

// Export specific function to check if we're in dev/demo mode
export const isDevOrDemoMode = (): boolean => {
  return import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true';
};
