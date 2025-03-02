
import { toast } from 'sonner';

// Função para obter o usuário atual (sempre retorna true)
export const getCurrentUser = async () => {
  return { success: true, user: { id: 'user-1', email: 'user@example.com' } };
};

// Função para verificar se o usuário está logado (sempre retorna true)
export const isAuthenticated = async () => {
  return true;
};

// Funções de autenticação (não fazem nada)
export const signUp = async (email: string, password: string, metadata: any = {}) => {
  return { success: true, data: { user: { id: 'user-1', email } } };
};

export const signIn = async (email: string, password: string) => {
  return { success: true, data: { user: { id: 'user-1', email } } };
};

export const signOut = async () => {
  return { success: true };
};

export const resetPassword = async (email: string) => {
  toast.success('Email de recuperação enviado com sucesso!');
  return { success: true };
};
