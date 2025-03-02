
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para o dashboard automaticamente
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        Redirecionando para o dashboard...
      </div>
    </div>
  );
};

export default Auth;
