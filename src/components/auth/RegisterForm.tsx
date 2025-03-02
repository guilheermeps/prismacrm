
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

interface RegisterFormProps {
  setActiveTab: (tab: string) => void;
}

const RegisterForm = ({ setActiveTab }: RegisterFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (password !== confirmPassword) {
      toast.error("As senhas não conferem");
      setLoading(false);
      return;
    }
    
    try {
      const { error, data } = await signUp(email, password, {
        full_name: fullName,
      });
      
      if (error) {
        toast.error(error.message || "Erro ao criar conta");
        return;
      }
      
      toast.success("Conta criada com sucesso! Verifique seu email para confirmar.");
      setActiveTab('login');
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nome completo</Label>
        <Input 
          id="fullName" 
          type="text" 
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)} 
          placeholder="Seu nome completo" 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input 
          id="register-email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="seu@email.com" 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-password">Senha</Label>
        <Input 
          id="register-password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar senha</Label>
        <Input 
          id="confirm-password" 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : null} 
        Criar conta
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-2">
        Já tem uma conta?{" "}
        <span 
          className="cursor-pointer text-primary hover:underline" 
          onClick={() => setActiveTab('login')}
        >
          Fazer login
        </span>
      </p>
    </form>
  );
};

export default RegisterForm;
