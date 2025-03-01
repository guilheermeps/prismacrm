
import { useState } from 'react';
import { Bell, User, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { userProfile, notifications } from '@/utils/mockData';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { toast } = useToast();
  const [unreadNotifications, setUnreadNotifications] = useState(
    notifications.filter(n => !n.read).length
  );
  
  const handleNotificationClick = () => {
    setUnreadNotifications(0);
    toast({
      title: "Notificações marcadas como lidas",
      description: "Todas as notificações foram visualizadas",
    });
  };

  return (
    <header className="w-full p-4 flex items-center justify-between bg-darker border-b border-studio-gray animate-fade-in">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="md:hidden text-studio-light hover:text-white hover:bg-studio-gray"
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-studio-orange">
            <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
            <AvatarFallback className="bg-studio-orange text-white">
              {userProfile.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="hidden sm:block">
            <h2 className="text-xl font-semibold">{userProfile.fullName}</h2>
            <p className="text-sm text-muted-foreground">{userProfile.handle}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-studio-light hover:text-white hover:bg-studio-gray"
            >
              <Bell className="h-6 w-6" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-studio-orange text-[10px] text-white">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 bg-darker border border-studio-gray">
            <div className="flex items-center justify-between p-2 border-b border-studio-gray">
              <span className="font-medium">Notificações</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleNotificationClick}
                className="text-xs hover:text-studio-orange"
              >
                Marcar todas como lidas
              </Button>
            </div>
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="p-3 focus:bg-studio-gray focus:text-white cursor-pointer">
                <div className="flex flex-col gap-1">
                  <span className={`${!notification.read ? 'font-medium' : ''}`}>
                    {notification.message}
                  </span>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-studio-light hover:text-white hover:bg-studio-gray"
            >
              <User className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-darker border border-studio-gray">
            <DropdownMenuItem className="focus:bg-studio-gray focus:text-white cursor-pointer">
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-studio-gray focus:text-white cursor-pointer">
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-studio-gray focus:text-white cursor-pointer">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
