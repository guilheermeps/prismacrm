
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LoaderCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";

const TestLoginButton = () => {
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, autoConfirmTestUser } = useAuth();

  // Function to create and login with test credentials
  const handleTestLogin = async () => {
    const testEmail = "teste@exemplo.com";
    const testPassword = "senha123";
    const testName = "Usuário Teste";
    
    setLoading(true);
    
    try {
      // Try to login directly first
      const { error: signInError } = await signIn(testEmail, testPassword);
      
      if (signInError) {
        console.log("Test user doesn't exist, creating it...");
        // User likely doesn't exist, create it
        const { error: signUpError, data } = await signUp(testEmail, testPassword, {
          full_name: testName,
        });
        
        if (signUpError) {
          console.error("Error creating test account:", signUpError);
          toast.error("Erro ao criar conta de teste: " + signUpError.message);
          setLoading(false);
          return;
        }
        
        toast.success("Conta de teste criada!");
        
        // Check if we need auto-confirmation
        if (data?.user && !data.user.email_confirmed_at) {
          toast.warning(
            "Para usar o login de teste, é necessário desabilitar a confirmação de email no Supabase",
            {
              duration: 8000,
              icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
              description: "Vá para Dashboard do Supabase > Authentication > Providers > Email",
            }
          );
          
          // Try to auto-confirm
          const confirmed = await autoConfirmTestUser(testEmail);
          if (confirmed) {
            toast.success("Email confirmado automaticamente!");
          }
        }
        
        // Try login after creation with a delay
        setTimeout(async () => {
          try {
            const { error: loginError } = await signIn(testEmail, testPassword);
            
            if (loginError) {
              console.error("Error logging in with test account:", loginError);
              toast.error("Erro ao fazer login com conta de teste: " + loginError.message);
            } else {
              toast.success("Login de teste realizado com sucesso!");
            }
          } catch (error: any) {
            console.error("Test login after creation error:", error);
            toast.error("Erro ao fazer login: " + error.message);
          } finally {
            setLoading(false);
          }
        }, 1500);
      } else {
        // User exists, login successful
        toast.success("Login de teste realizado com sucesso!");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Test login error:", error);
      toast.error("Erro ao fazer login de teste: " + error.message);
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      className="w-full" 
      onClick={handleTestLogin}
      disabled={loading}
    >
      {loading ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : null}
      Entrar com conta de teste
    </Button>
  );
};

export default TestLoginButton;
