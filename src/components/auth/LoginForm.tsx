
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

interface LoginFormProps {
  setActiveTab: (tab: string) => void;
}

const LoginForm = ({ setActiveTab }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message || "Erro ao fazer login");
        return;
      }
      
      toast.success("Login realizado com sucesso!");
      // Navigation happens in the signIn function
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="seu@email.com" 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input 
          id="password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : null} 
        Entrar
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-2">
        Ainda não tem uma conta?{" "}
        <span 
          className="cursor-pointer text-primary hover:underline" 
          onClick={() => setActiveTab('register')}
        >
          Cadastre-se
        </span>
      </p>
    </form>
  );
};

export default LoginForm;
