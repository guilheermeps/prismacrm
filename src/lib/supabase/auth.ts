
import { supabase } from './client';
import { toast } from 'sonner';

// Função para registrar um novo usuário
export const signUp = async (email: string, password: string, metadata: any = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });

    if (error) {
      toast.error(`Erro ao criar conta: ${error.message}`);
      return { success: false, error };
    }

    toast.success('Conta criada com sucesso! Verifique seu email para confirmar.');
    return { success: true, data };
  } catch (error: any) {
    toast.error(`Erro ao criar conta: ${error.message}`);
    return { success: false, error };
  }
};

// Função para fazer login
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast.error(`Erro ao fazer login: ${error.message}`);
      return { success: false, error };
    }

    toast.success('Login realizado com sucesso!');
    return { success: true, data };
  } catch (error: any) {
    toast.error(`Erro ao fazer login: ${error.message}`);
    return { success: false, error };
  }
};

// Função para fazer logout
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(`Erro ao fazer logout: ${error.message}`);
      return { success: false, error };
    }

    toast.success('Logout realizado com sucesso!');
    return { success: true };
  } catch (error: any) {
    toast.error(`Erro ao fazer logout: ${error.message}`);
    return { success: false, error };
  }
};

// Função para recuperar senha
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(`Erro ao enviar email de recuperação: ${error.message}`);
      return { success: false, error };
    }

    toast.success('Email de recuperação enviado com sucesso!');
    return { success: true };
  } catch (error: any) {
    toast.error(`Erro ao enviar email de recuperação: ${error.message}`);
    return { success: false, error };
  }
};

// Função para obter o usuário atual
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      return { success: false, error };
    }
    
    return { success: true, user: data.user };
  } catch (error: any) {
    return { success: false, error };
  }
};

// Função para verificar se o usuário está logado
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};
