
import React, { useState } from 'react';
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, CheckSquare, AlertCircle, Clock } from 'lucide-react';

const Projects = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
              <h1 className="text-xl md:text-2xl font-bold">Projetos</h1>
              <Button className="mt-2 md:mt-0 flex items-center gap-1 w-fit">
                <PlusCircle className="h-4 w-4" />
                <span>Novo Projeto</span>
              </Button>
            </div>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="in-progress">Em Andamento</TabsTrigger>
                <TabsTrigger value="completed">Concluídos</TabsTrigger>
                <TabsTrigger value="delayed">Atrasados</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ProjectCard 
                    title="Website E-commerce"
                    client="ABC Comércio"
                    progress={75}
                    dueDate="15/06/2023"
                    status="in-progress"
                  />
                  <ProjectCard 
                    title="Identidade Visual"
                    client="Startup XYZ"
                    progress={100}
                    dueDate="02/05/2023"
                    status="completed"
                  />
                  <ProjectCard 
                    title="Campanha de Marketing"
                    client="Restaurante Sabor"
                    progress={30}
                    dueDate="10/04/2023"
                    status="delayed"
                  />
                  <ProjectCard 
                    title="Aplicativo Mobile"
                    client="Tech Solutions"
                    progress={60}
                    dueDate="28/06/2023"
                    status="in-progress"
                  />
                  <ProjectCard 
                    title="Redesign de Logo"
                    client="Fashion Store"
                    progress={100}
                    dueDate="20/05/2023"
                    status="completed"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="in-progress" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ProjectCard 
                    title="Website E-commerce"
                    client="ABC Comércio"
                    progress={75}
                    dueDate="15/06/2023"
                    status="in-progress"
                  />
                  <ProjectCard 
                    title="Aplicativo Mobile"
                    client="Tech Solutions"
                    progress={60}
                    dueDate="28/06/2023"
                    status="in-progress"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ProjectCard 
                    title="Identidade Visual"
                    client="Startup XYZ"
                    progress={100}
                    dueDate="02/05/2023"
                    status="completed"
                  />
                  <ProjectCard 
                    title="Redesign de Logo"
                    client="Fashion Store"
                    progress={100}
                    dueDate="20/05/2023"
                    status="completed"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="delayed" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ProjectCard 
                    title="Campanha de Marketing"
                    client="Restaurante Sabor"
                    progress={30}
                    dueDate="10/04/2023"
                    status="delayed"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

interface ProjectCardProps {
  title: string;
  client: string;
  progress: number;
  dueDate: string;
  status: 'in-progress' | 'completed' | 'delayed';
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, client, progress, dueDate, status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckSquare className="h-5 w-5 text-green-500" />;
      case 'delayed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'delayed':
        return 'Atrasado';
      default:
        return 'Em Andamento';
    }
  };
  
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">Cliente: {client}</p>
        </div>
        {getStatusIcon()}
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Progresso</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm">Prazo: {dueDate}</span>
        <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
    </Card>
  );
};

export default Projects;
