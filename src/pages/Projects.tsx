
import React, { useState } from 'react';
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Folder, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Projects = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const projects = [
    {
      id: 1,
      name: "Website Corporativo",
      client: "Empresa A",
      dueDate: "15/10/2023",
      status: "Em andamento",
      completion: 65
    },
    {
      id: 2,
      name: "Redesign de Logo",
      client: "Empresa B",
      dueDate: "28/09/2023",
      status: "Concluído",
      completion: 100
    },
    {
      id: 3,
      name: "Campanha Marketing",
      client: "Empresa C",
      dueDate: "05/11/2023",
      status: "Não iniciado",
      completion: 0
    }
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-3 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6">
              <h1 className="text-xl md:text-2xl font-bold">Projetos</h1>
              <Button className="mt-2 md:mt-0" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Novo Projeto
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        <Folder className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                          <CardTitle className="text-md font-semibold">{project.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">Cliente: {project.client}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Status:</span>
                        <span className={`font-medium ${
                          project.status === "Concluído" ? "text-green-600" :
                          project.status === "Em andamento" ? "text-blue-600" :
                          "text-gray-600"
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Prazo:</span>
                        <span>{project.dueDate}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progresso:</span>
                          <span>{project.completion}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${project.completion}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      Gerenciar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <Card className="flex flex-col items-center justify-center h-[260px] border-dashed">
                <Plus className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">Criar novo projeto</p>
                <Button variant="outline">Começar</Button>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Projects;
