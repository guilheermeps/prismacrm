
import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Filter, MapPin, Plus, Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { upcomingSchedule } from '@/utils/mockData';

interface EventType {
  id: number;
  client: string;
  service: string;
  date: string;
  time: string;
  location: string;
}

const Schedule = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [date, setDate] = useState<Date>(new Date());
  const [events] = useState<EventType[]>(upcomingSchedule);
  const [searchTerm, setSearchTerm] = useState('');
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const filteredEvents = events.filter(event => 
    event.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const eventsForSelectedDate = filteredEvents.filter(
    event => event.date === format(date, 'yyyy-MM-dd')
  );
  
  // Styling functions
  const getServiceColor = (service: string) => {
    switch (service) {
      case 'Casamento':
        return 'bg-studio-orange';
      case 'Formatura':
        return 'bg-purple-500';
      case 'Gestante':
        return 'bg-pink-500';
      case '15 anos':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className="min-h-screen flex w-full bg-dark text-white">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full animate-fade-in">
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Agenda</h1>
              <p className="text-muted-foreground">Gerencie os agendamentos de suas sessões</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-studio-orange hover:bg-studio-orange/90 text-white">
                <Plus className="h-4 w-4 mr-2" /> Novo Agendamento
              </Button>
            </div>
          </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="bg-card rounded-xl border border-studio-gray p-4 lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Calendário</h2>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}
                    className="h-8 w-8 border-studio-gray"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}
                    className="h-8 w-8 border-studio-gray"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                className="rounded-md border-studio-gray"
                classNames={{
                  day_selected: "bg-studio-orange text-primary-foreground hover:bg-studio-orange hover:text-primary-foreground focus:bg-studio-orange focus:text-primary-foreground",
                  day_today: "bg-studio-gray text-white",
                }}
              />
              
              <div className="mt-4 space-y-1">
                <h3 className="text-sm font-medium">Tipos de Sessão:</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-studio-orange"></div>
                    <span className="text-xs">Casamento</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    <span className="text-xs">Formatura</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-pink-500"></div>
                    <span className="text-xs">Gestante</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs">15 anos</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Events for selected date */}
            <div className="bg-card rounded-xl border border-studio-gray overflow-hidden lg:col-span-2">
              <div className="p-4 border-b border-studio-gray flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-medium">
                  Agendamentos: {format(date, 'dd/MM/yyyy')}
                </h2>
                
                <div className="flex gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar agendamentos..."
                      className="pl-9 w-full bg-studio-gray border-studio-gray"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon" className="border-studio-gray">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 bg-darker border border-studio-gray p-0" align="end">
                      <div className="p-3 border-b border-studio-gray">
                        <h3 className="text-sm font-medium">Filtrar por</h3>
                      </div>
                      <div className="p-3 space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs" htmlFor="service-filter">Tipo de Serviço</label>
                          <Select>
                            <SelectTrigger id="service-filter" className="border-studio-gray bg-studio-gray">
                              <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent className="bg-darker border border-studio-gray">
                              <SelectItem value="all">Todos</SelectItem>
                              <SelectItem value="wedding">Casamento</SelectItem>
                              <SelectItem value="graduation">Formatura</SelectItem>
                              <SelectItem value="pregnancy">Gestante</SelectItem>
                              <SelectItem value="birthday">15 anos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs" htmlFor="location-filter">Local</label>
                          <Select>
                            <SelectTrigger id="location-filter" className="border-studio-gray bg-studio-gray">
                              <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent className="bg-darker border border-studio-gray">
                              <SelectItem value="all">Todos</SelectItem>
                              <SelectItem value="studio">Estúdio</SelectItem>
                              <SelectItem value="external">Externo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full bg-studio-orange hover:bg-studio-orange/90 text-white">
                          Aplicar Filtros
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="p-4">
                {eventsForSelectedDate.length > 0 ? (
                  <div className="space-y-4">
                    {eventsForSelectedDate.map((event) => (
                      <div 
                        key={event.id} 
                        className="bg-studio-gray/30 rounded-lg p-4 border border-studio-gray hover:border-studio-orange transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`${getServiceColor(event.service)}`}>
                                {event.service}
                              </Badge>
                              <h3 className="font-medium">{event.client}</h3>
                            </div>
                            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="text-xs border-studio-gray hover:border-studio-orange hover:text-studio-orange">
                              Detalhes
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center text-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium">Nenhum agendamento</h3>
                    <p className="text-muted-foreground">
                      Não há agendamentos para esta data.
                    </p>
                    <Button className="mt-4 bg-studio-orange hover:bg-studio-orange/90 text-white">
                      <Plus className="h-4 w-4 mr-2" /> Adicionar Agendamento
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Schedule;
