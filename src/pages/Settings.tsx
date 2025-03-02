
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "@/components/settings/ProfileSettings";
import ServiceTypeSettings from "@/components/settings/ServiceTypeSettings";
import { User, Shield, Tags, PenLine } from "lucide-react";

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Configurações</h1>
            <div className="bg-card rounded-lg p-3 md:p-5">
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">Perfil</span>
                  </TabsTrigger>
                  <TabsTrigger value="service-types" className="flex items-center gap-2">
                    <Tags className="h-4 w-4" />
                    <span className="hidden md:inline">Tipos de Serviço</span>
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center gap-2">
                    <PenLine className="h-4 w-4" />
                    <span className="hidden md:inline">Documentos</span>
                  </TabsTrigger>
                  <TabsTrigger value="permissions" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden md:inline">Permissões</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <ProfileSettings />
                </TabsContent>

                <TabsContent value="service-types">
                  <ServiceTypeSettings />
                </TabsContent>

                <TabsContent value="documents">
                  <div className="bg-card rounded-lg border p-8 text-center">
                    <h3 className="text-lg font-medium mb-2">Gerenciamento de Documentos</h3>
                    <p className="text-muted-foreground">
                      Esta funcionalidade estará disponível em breve.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="permissions">
                  <div className="bg-card rounded-lg border p-8 text-center">
                    <h3 className="text-lg font-medium mb-2">Permissões de Usuários</h3>
                    <p className="text-muted-foreground">
                      Esta funcionalidade estará disponível em breve.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
