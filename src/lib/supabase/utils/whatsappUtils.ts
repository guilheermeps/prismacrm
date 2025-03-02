
// WhatsApp utility functions

// Function to format WhatsApp number
export const formatWhatsAppNumber = (number: string): string => {
  if (!number) return '';
  
  // Remove any non-digit characters
  const digits = number.replace(/\D/g, '');
  
  // If it doesn't start with country code, add Brazilian code (55)
  if (digits.length <= 11) {
    return `55${digits}`;
  }
  
  return digits;
};

// Function to get WhatsApp URL
export const getWhatsAppUrl = (number: string): string => {
  if (!number) return '';
  
  const formattedNumber = formatWhatsAppNumber(number);
  return `https://api.whatsapp.com/send?phone=${formattedNumber}`;
};
