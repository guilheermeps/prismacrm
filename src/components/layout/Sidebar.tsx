
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
  X
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

const mobileNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/sales-pipeline', label: 'Leads', icon: Target },
  { path: '/contacts', label: 'Contatos', icon: Users },
  { path: '/schedule', label: 'Agenda', icon: CalendarDays },
  { path: '/reports', label: 'Relatórios', icon: BarChart },
];

const desktopNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/sales-pipeline', label: 'Leads', icon: Target },
  { path: '/contacts', label: 'Contatos', icon: Users },
  { path: '/schedule', label: 'Agenda', icon: CalendarDays },
  { path: '/products', label: 'Produtos', icon: Package },
  { path: '/orders-contracts', label: 'Pedidos e Contratos', icon: FileText },
  { path: '/financial', label: 'Financeiro', icon: Banknote },
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
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-darker border-t border-studio-gray">
        <div className="flex justify-between items-center px-1">
          {mobileNavItems.map((item) => (
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
            className="text-studio-light hover:text-white p-2"
            onClick={toggle}
          >
            <span className="sr-only">More</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <Sheet open={isOpen && window.innerWidth < 768} onOpenChange={toggle}>
        <SheetContent side="left" className="w-[80%] p-0 bg-darker border-r border-studio-gray">
          <SheetHeader className="px-4 py-3 border-b border-studio-gray">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-white">
                <div className="flex items-center">
                  <img 
                    src="/lovable-uploads/d6af68b5-dd34-496c-ab4b-789c04482342.png" 
                    alt="Prisma CM" 
                    className="h-10 w-auto object-contain"
                  />
                </div>
              </SheetTitle>
              <SheetClose className="text-studio-light hover:text-white">
                <X className="h-5 w-5" />
              </SheetClose>
            </div>
          </SheetHeader>
          <div className="py-4 px-2 overflow-y-auto">
            <ul className="space-y-1">
              {desktopNavItems.map((item) => (
                <li key={item.path}>
                  <NavLink 
                    to={item.path} 
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm",
                      isActive 
                        ? "bg-studio-gray text-white" 
                        : "text-studio-light hover:bg-studio-gray/80 hover:text-white"
                    )}
                    onClick={toggle}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - Hidden on Mobile */}
      <aside className="hidden md:block fixed md:sticky left-0 top-0 z-30 h-screen w-64 bg-darker border-r border-studio-gray transition-all duration-300 ease-in-out">
        {/* Logo area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-studio-gray">
          <div className="flex items-center justify-center">
            <img 
              src="/lovable-uploads/d6af68b5-dd34-496c-ab4b-789c04482342.png" 
              alt="Prisma CM" 
              className="h-12 w-auto object-contain"
            />
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          <ul className="space-y-1">
            {desktopNavItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm",
                    isActive 
                      ? "bg-studio-gray text-white" 
                      : "text-studio-light hover:bg-studio-gray/80 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
