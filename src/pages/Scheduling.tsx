
import React, { useState } from 'react';
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { addMonths, subMonths, format } from 'date-fns';
import { pt } from 'date-fns/locale';

const Scheduling = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-3 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6">
              <h1 className="text-xl md:text-2xl font-bold">Agenda</h1>
              <Button className="mt-2 md:mt-0" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Novo Agendamento
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="col-span-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-md font-medium">Calendário</CardTitle>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={prevMonth}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium mx-2">
                      {format(currentDate, 'MMMM yyyy', { locale: pt })}
                    </span>
                    <Button variant="ghost" size="icon" onClick={nextMonth}>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    month={currentDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
              
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {selectedDate ? (
                      format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: pt })
                    ) : (
                      "Selecione uma data"
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhum evento para esta data</p>
                      <Button variant="outline" className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Evento
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Selecione uma data no calendário para ver ou adicionar eventos</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Próximos eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Não há eventos agendados para os próximos dias</p>
                </CardContent>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Scheduling;
