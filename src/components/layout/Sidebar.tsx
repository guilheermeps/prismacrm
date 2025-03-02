
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  CreditCard, 
  BarChart,
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Rocket,
  FileText,
  Package,
  Users,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { userProfile } from '@/utils/mockData';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/sales-pipeline', label: 'Leads', icon: Target },
  { path: '/contacts', label: 'Contatos', icon: Users },
  { path: '/schedule', label: 'Agenda', icon: CalendarDays },
  { path: '/products', label: 'Produtos', icon: Package },
  { path: '/orders-contracts', label: 'Pedidos e Contratos', icon: FileText },
  { path: '/payments', label: 'Financeiro', icon: CreditCard },
  { path: '/reports', label: 'Relatórios', icon: BarChart },
  { path: '/settings', label: 'Configurações', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar = ({ isOpen, toggle }: SidebarProps) => {
  const location = useLocation();
  
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={toggle}
        />
      )}
    
      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-30 h-screen bg-darker border-r border-studio-gray transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0 md:w-20",
        "flex flex-col"
      )}>
        {/* Logo area */}
        <div className={cn(
          "h-16 flex items-center justify-between px-4 border-b border-studio-gray",
          !isOpen && "md:justify-center"
        )}>
          {isOpen ? (
            <>
              <div className="flex items-center gap-2">
                <div className="prisma-bars">
                  <div className="prisma-bar prisma-bar-teal"></div>
                  <div className="prisma-bar prisma-bar-red"></div>
                  <div className="prisma-bar prisma-bar-orange"></div>
                  <div className="prisma-bar prisma-bar-yellow"></div>
                </div>
                <span className="font-semibold text-lg text-prisma-text">Prisma CM</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggle}
                className="text-studio-light hover:text-white hover:bg-studio-gray"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <div className="prisma-bars scale-75">
                <div className="prisma-bar prisma-bar-teal"></div>
                <div className="prisma-bar prisma-bar-red"></div>
                <div className="prisma-bar prisma-bar-orange"></div>
                <div className="prisma-bar prisma-bar-yellow"></div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggle}
                className="text-studio-light hover:text-white hover:bg-studio-gray hidden md:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
        
        {/* Navigation */}
        <nav className={cn(
          "flex-1 py-6 px-2 overflow-y-auto",
          !isOpen && "md:px-1"
        )}>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all",
                    isActive 
                      ? "bg-studio-gray text-white" 
                      : "text-studio-light hover:bg-studio-gray/80 hover:text-white",
                    !isOpen && "md:justify-center md:px-2"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {isOpen && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Footer - User Profile */}
        {isOpen && (
          <div className="p-4 border-t border-studio-gray">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-studio-gray flex items-center justify-center text-white font-medium">
                {userProfile.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userProfile.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">{userProfile.handle}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
