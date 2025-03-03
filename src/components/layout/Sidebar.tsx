import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Package, 
  ListChecks, 
  CreditCard, 
  BarChart3, 
  Bot,
  Menu
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const navigation = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard size={16} />,
      href: '/dashboard',
    },
    {
      label: 'Pipeline de Vendas',
      icon: <BarChart3 size={16} />,
      href: '/sales-pipeline',
    },
    {
      label: 'Contatos',
      icon: <Users size={16} />,
      href: '/contacts',
    },
    {
      label: 'Contratos',
      icon: <FileText size={16} />,
      href: '/contracts',
    },
    {
      label: 'Pedidos',
      icon: <Package size={16} />,
      href: '/orders',
    },
    {
      label: 'Tarefas',
      icon: <ListChecks size={16} />,
      href: '/tasks',
    },
    {
      label: 'Financeiro',
      icon: <CreditCard size={16} />,
      href: '/finances',
    },
    {
      label: 'Assistente IA',
      icon: <Bot size={16} />,
      href: '/ai-assistant',
    },
    {
      label: 'Configurações',
      icon: <Settings size={16} />,
      href: '/settings',
    },
  ];

  const SidebarContent = (
    <div className={cn("pb-12 h-full flex flex-col", className)}>
      <div className="py-4 px-3 border-b">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
          <h1 className="text-lg font-bold">CRM Pro</h1>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                location.pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4">
        <p className="text-xs text-muted-foreground text-center">
          CRM Pro v1.0.0
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed left-4 top-4 z-40">
            <Menu size={16} />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          {SidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="hidden border-r bg-card md:block w-72">
      {SidebarContent}
    </div>
  );
}
