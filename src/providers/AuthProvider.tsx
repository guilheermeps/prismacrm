
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: Error | null, data?: any }>;
  autoConfirmTestUser: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  autoConfirmTestUser: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log("Auth state changed:", _event, !!newSession);
        setSession(newSession);
        setUser(newSession?.user || null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error && error.message.includes("Email not confirmed")) {
        // Try to auto-confirm the test user
        const confirmed = await autoConfirmTestUser(email);
        if (confirmed) {
          // Try login again after confirmation
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (!retryError) {
            navigate('/dashboard');
            return { error: null };
          }
          
          return { error: retryError as Error };
        }
      }
      
      if (!error) {
        navigate('/dashboard');
      }
      
      return { error };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      
      return { error, data };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error: error as Error };
    }
  };

  // Function to auto-confirm test user (for development only)
  const autoConfirmTestUser = async (email: string): Promise<boolean> => {
    // This is a workaround for development only
    // In production, you should use proper email confirmation
    if (email === "teste@exemplo.com") {
      toast.info("Tentando confirmar usuário de teste automaticamente...");
      // For now, just show a message to the user
      toast.error("É necessário habilitar a configuração 'Disable email confirmation' no Supabase");
      toast.info("Acesse o dashboard do Supabase > Authentication > Providers > Email");
      return false;
    }
    return false;
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    signIn,
    signUp,
    autoConfirmTestUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
