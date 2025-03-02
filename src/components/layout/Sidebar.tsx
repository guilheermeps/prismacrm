
import { useLocation, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BarChart,
  Settings, 
  FileText,
  Package,
  Users,
  Target,
  Banknote,
  MoreHorizontal,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import { useState } from 'react';

const mainNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/sales-pipeline', label: 'Leads', icon: Target },
  { path: '/contacts', label: 'Contatos', icon: Users },
  { path: '/schedule', label: 'Agenda', icon: CalendarDays },
  { path: '/reports', label: 'Relatórios', icon: BarChart },
];

const moreNavItems = [
  { path: '/products', label: 'Produtos', icon: Package },
  { path: '/orders', label: 'Pedidos', icon: ClipboardList },
  { path: '/contracts', label: 'Contratos', icon: FileText },
  { path: '/orders-contracts', label: 'Novo Pedido/Contrato', icon: FileText },
  { path: '/financial', label: 'Financeiro', icon: Banknote },
  { path: '/projects', label: 'Projetos', icon: FileText },
  { path: '/settings', label: 'Configurações', icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  
  return (
    <>
      {/* Bottom Navigation for All Screen Sizes */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-darker border-t border-studio-gray">
        <div className="flex justify-between items-center px-1">
          {mainNavItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center py-2 px-3",
                isActive 
                  ? "text-primary" 
                  : "text-studio-light hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center justify-center py-2 px-3 text-studio-light hover:text-white"
            onClick={() => setIsMoreMenuOpen(true)}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-xs mt-1">Mais</span>
          </Button>
        </div>
      </div>

      {/* More Menu Sheet */}
      <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
        <SheetContent side="bottom" className="h-auto max-h-[70vh] rounded-t-xl bg-darker border-t border-studio-gray px-2 py-4">
          <SheetHeader className="px-2 mb-4">
            <SheetTitle className="text-white text-center">Mais opções</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-4 gap-4">
            {moreNavItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className={({ isActive }) => cn(
                  "flex flex-col items-center justify-center p-3 rounded-md transition-all",
                  isActive 
                    ? "bg-studio-gray text-primary" 
                    : "text-studio-light hover:bg-studio-gray/80 hover:text-white"
                )}
                onClick={() => setIsMoreMenuOpen(false)}
              >
                <item.icon className="h-6 w-6 mb-2" />
                <span className="text-xs text-center">{item.label}</span>
              </NavLink>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <SheetClose asChild>
              <Button variant="secondary" size="sm">Fechar</Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
