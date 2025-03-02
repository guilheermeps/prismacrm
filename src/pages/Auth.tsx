
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/providers/AuthProvider";
import AuthHeader from '@/components/auth/AuthHeader';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import TestLoginButton from '@/components/auth/TestLoginButton';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { session } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    console.log("Auth page loaded, checking session:", !!session);
    if (session) {
      navigate('/dashboard');
    }
  }, [navigate, session]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/30">
      <div className="w-full max-w-md px-4">
        <AuthHeader />
        
        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
              </TabsList>
              
              <div className="mt-4">
                {activeTab === 'login' ? (
                  <>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Entre com seus dados para acessar o sistema</CardDescription>
                  </>
                ) : (
                  <>
                    <CardTitle>Cadastro</CardTitle>
                    <CardDescription>Crie sua conta para utilizar o sistema</CardDescription>
                  </>
                )}
              </div>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="login">
                <LoginForm setActiveTab={setActiveTab} />
              </TabsContent>
              
              <TabsContent value="register">
                <RegisterForm setActiveTab={setActiveTab} />
              </TabsContent>
            </Tabs>
            
            <div className="mt-4">
              <TestLoginButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
