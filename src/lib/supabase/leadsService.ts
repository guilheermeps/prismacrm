
// Re-export all lead-related functions
export { getLeads, createLead, updateLead, deleteLead } from './services/leadsCrudService';
export { formatWhatsAppNumber, getWhatsAppUrl } from './utils/whatsappUtils';
export { type Lead } from './types';  // Ensure Lead type is exported

// Add function to get service types
export { getServiceTypes } from './services/serviceTypeService';
