// src/SecretariaDashboard.tsx
import React from 'react';
import { Frequencia } from './Frequencia';
import { LayoutWithSidebar } from './components/layout-with-sidebar';

// Definimos a interface do Profile aqui também para garantir a segurança dos tipos.
interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'professor' | 'responsavel' | 'aluno' | 'secretaria';
}

// CORREÇÃO: O componente agora espera receber a propriedade 'profile', e não 'userRole'.
const SecretariaDashboard: React.FC<{ profile: Profile }> = ({ profile }) => {
  const breadcrumbs = [
    { title: "Dashboard", url: "/secretaria-dashboard" },
    { title: "Secretaria" }
  ];

  return (
    <LayoutWithSidebar 
      userType="secretaria" 
      currentPath="/secretaria-dashboard"
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Painel da Secretaria</h1>
          <p className="text-muted-foreground mt-1">Gerencie a frequência e dados dos alunos.</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Registo de Frequência</h2>
          {/* CORREÇÃO: Passamos a propriedade 'profile' para o componente Frequencia. */}
          <Frequencia profile={profile} />
        </div>
      </div>
    </LayoutWithSidebar>
  );
};

export default SecretariaDashboard;
