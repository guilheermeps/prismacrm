
import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}
