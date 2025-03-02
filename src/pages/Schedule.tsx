import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Filter, MapPin, Plus, Search, Trash2, Edit } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { getScheduleEvents, ScheduleEvent, deleteScheduleEvent } from '@/lib/supabase/schedulingService';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const Schedule = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  
  useEffect(() => {
    loadScheduleEvents();
  }, []);
  
  const loadScheduleEvents = async () => {
    setLoading(true);
    try {
      const eventsData = await getScheduleEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error("Error loading schedule events:", error);
      toast.error("Erro ao carregar eventos da agenda");
    } finally {
      setLoading(false);
    }
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchTerm || 
      event.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesService = serviceFilter === 'all' || 
      event.service.toLowerCase() === serviceFilter.toLowerCase();
    
    const matchesLocation = locationFilter === 'all' ||
      (locationFilter === 'studio' && event.location.toLowerCase().includes('estúdio')) ||
      (locationFilter === 'external' && !event.location.toLowerCase().includes('estúdio'));
    
    return matchesSearch && matchesService && matchesLocation;
  });
  
  const eventsForSelectedDate = filteredEvents.filter(
    event => event.date === format(date, 'yyyy-MM-dd')
  );
  
  // Styling functions
  const getServiceColor = (service: string) => {
    const serviceLower = service.toLowerCase();
    if (serviceLower.includes('casamento')) return 'bg-studio-orange';
    if (serviceLower.includes('formatura')) return 'bg-purple-500';
    if (serviceLower.includes('gestante')) return 'bg-pink-500';
    if (serviceLower.includes('15 anos')) return 'bg-blue-500';
    return 'bg-gray-500';
  };
  
  const handleApplyFilters = () => {
    toast.success("Filtros aplicados");
  };
  
  const handleDeleteEvent = async (eventId: string) => {
    if (!eventId) return;
    
    try {
      const success = await deleteScheduleEvent(eventId);
      if (success) {
        loadScheduleEvents();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Erro ao excluir evento");
    }
  };
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  const confirmDelete = (eventId: string) => {
    setSelectedEventId(eventId);
    setDeleteDialogOpen(true);
  };
  
  const executeDelete = async () => {
    if (selectedEventId) {
      await handleDeleteEvent(selectedEventId);
      setDeleteDialogOpen(false);
      setSelectedEventId(null);
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
                          <Select value={serviceFilter} onValueChange={setServiceFilter}>
                            <SelectTrigger id="service-filter" className="border-studio-gray bg-studio-gray">
                              <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent className="bg-darker border border-studio-gray">
                              <SelectItem value="all">Todos</SelectItem>
                              <SelectItem value="casamento">Casamento</SelectItem>
                              <SelectItem value="formatura">Formatura</SelectItem>
                              <SelectItem value="gestante">Gestante</SelectItem>
                              <SelectItem value="15 anos">15 anos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs" htmlFor="location-filter">Local</label>
                          <Select value={locationFilter} onValueChange={setLocationFilter}>
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
                        <Button 
                          className="w-full bg-studio-orange hover:bg-studio-orange/90 text-white"
                          onClick={handleApplyFilters}
                        >
                          Aplicar Filtros
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="p-4">
                {loading ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center">
                    <div className="animate-spin h-8 w-8 border-2 border-studio-orange border-t-transparent rounded-full"></div>
                    <p className="mt-4 text-muted-foreground">Carregando agendamentos...</p>
                  </div>
                ) : eventsForSelectedDate.length > 0 ? (
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
                              {event.source_type && (
                                <div className="mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {event.source_type === 'order' ? 'Pedido' : 'Contrato'}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="text-xs border-studio-gray hover:border-studio-orange hover:text-studio-orange">
                              <Edit className="h-3 w-3 mr-1" /> Editar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs border-studio-gray hover:border-red-500 hover:text-red-500"
                              onClick={() => event.id && confirmDelete(event.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" /> Excluir
                            </Button>
                          </div>
                        </div>
                        {event.notes && (
                          <div className="mt-2 pt-2 border-t border-studio-gray text-sm text-muted-foreground">
                            {event.notes}
                          </div>
                        )}
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
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-darker border border-studio-gray">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este evento da agenda? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-studio-gray bg-studio-gray">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Schedule;
