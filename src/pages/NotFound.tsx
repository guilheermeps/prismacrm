
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="text-center max-w-md p-6 animate-fade-in">
        <h1 className="text-8xl font-bold mb-4 text-studio-orange">404</h1>
        <p className="text-2xl text-white mb-6">Página não encontrada</p>
        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button asChild className="bg-studio-orange hover:bg-studio-orange/90 text-white">
          <a href="/" className="inline-flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Voltar para o Dashboard</span>
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
