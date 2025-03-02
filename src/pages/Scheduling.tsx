
import React, { useState } from 'react';
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const Scheduling = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
              <Button className="mt-2 md:mt-0 flex items-center gap-1 w-fit">
                <PlusCircle className="h-4 w-4" />
                <span>Agendar Evento</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <Card className="p-4 lg:col-span-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </Card>
              
              <Card className="p-4 lg:col-span-8">
                <h2 className="text-lg font-semibold mb-4">Eventos do Dia</h2>
                <div className="space-y-4">
                  <div className="border p-3 rounded-md hover:bg-accent transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Reunião com cliente</h3>
                        <p className="text-sm text-muted-foreground">09:30 - 10:30</p>
                      </div>
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">Reunião</span>
                    </div>
                    <p className="text-sm mt-2">Cliente: João Silva</p>
                    <p className="text-sm">Local: Escritório central</p>
                  </div>
                  
                  <div className="border p-3 rounded-md hover:bg-accent transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Entrega de produto</h3>
                        <p className="text-sm text-muted-foreground">14:00 - 15:00</p>
                      </div>
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Entrega</span>
                    </div>
                    <p className="text-sm mt-2">Cliente: Maria Oliveira</p>
                    <p className="text-sm">Local: Av. Paulista, 1000</p>
                  </div>
                  
                  <div className="border p-3 rounded-md hover:bg-accent transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Assinatura de contrato</h3>
                        <p className="text-sm text-muted-foreground">16:30 - 17:30</p>
                      </div>
                      <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">Contrato</span>
                    </div>
                    <p className="text-sm mt-2">Cliente: Carlos Mendes</p>
                    <p className="text-sm">Local: Virtual (Zoom)</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Scheduling;
