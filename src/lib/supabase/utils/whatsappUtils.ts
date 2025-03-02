
// Formatar número de WhatsApp para exibição no padrão brasileiro
export function formatWhatsAppNumber(phone: string): string {
  if (!phone) return '';
  
  // Remove tudo que não for dígito
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Se não houver dígitos, retorna string vazia
  if (!digitsOnly) return '';
  
  // Formata o número de acordo com o padrão brasileiro
  if (digitsOnly.length === 11) {
    // Formato: (XX) X XXXX-XXXX
    return `(${digitsOnly.substring(0, 2)}) ${digitsOnly.substring(2, 3)} ${digitsOnly.substring(3, 7)}-${digitsOnly.substring(7)}`;
  } else if (digitsOnly.length === 10) {
    // Formato: (XX) XXXX-XXXX
    return `(${digitsOnly.substring(0, 2)}) ${digitsOnly.substring(2, 6)}-${digitsOnly.substring(6)}`;
  } else {
    // Se não tiver o formato esperado, retorna sem formatação
    return digitsOnly;
  }
}

// Obter URL para WhatsApp baseado no número
export function getWhatsAppUrl(phone: string): string {
  if (!phone) return '#';
  
  // Remove tudo que não for dígito
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Se não houver dígitos, retorna #
  if (!digitsOnly) return '#';
  
  // Adicionar código do país (Brasil) se não estiver incluído
  const whatsappNumber = digitsOnly.startsWith('55') ? digitsOnly : `55${digitsOnly}`;
  
  // Retorna a URL do WhatsApp
  return `https://wa.me/${whatsappNumber}`;
}
