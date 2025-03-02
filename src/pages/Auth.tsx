
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { user, session, signIn, signUp } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    console.log("Auth page loaded, checking session:", !!session);
    if (session) {
      navigate('/dashboard');
    }
  }, [navigate, session]);

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (password !== confirmPassword) {
      toast.error("As senhas não conferem");
      setLoading(false);
      return;
    }
    
    try {
      const { error } = await signUp(email, password, {
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
    <div className="flex items-center justify-center min-h-screen bg-secondary/30">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Prisma CRM</h1>
          <p className="text-muted-foreground">Gerencie seus leads, contatos e negócios</p>
        </div>
        
        <Card>
          <CardHeader>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-4">
                <CardTitle>Login</CardTitle>
                <CardDescription>Entre com seus dados para acessar o sistema</CardDescription>
              </TabsContent>
              
              <TabsContent value="register" className="mt-4">
                <CardTitle>Cadastro</CardTitle>
                <CardDescription>Crie sua conta para utilizar o sistema</CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <TabsContent value="login" className="mt-0">
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
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="mt-0">
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
              </form>
            </TabsContent>
          </CardContent>
          
          <CardFooter className="flex flex-col">
            <p className="text-center text-sm text-muted-foreground mt-2">
              {activeTab === 'login' ? (
                <>
                  Ainda não tem uma conta?{" "}
                  <span 
                    className="cursor-pointer text-primary hover:underline" 
                    onClick={() => setActiveTab('register')}
                  >
                    Cadastre-se
                  </span>
                </>
              ) : (
                <>
                  Já tem uma conta?{" "}
                  <span 
                    className="cursor-pointer text-primary hover:underline" 
                    onClick={() => setActiveTab('login')}
                  >
                    Fazer login
                  </span>
                </>
              )}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
