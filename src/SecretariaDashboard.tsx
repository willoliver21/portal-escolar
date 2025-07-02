// src/SecretariaDashboard.tsx
import React from 'react';
import { Frequencia } from './Frequencia';

// Definimos a interface do Profile aqui também para garantir a segurança dos tipos.
interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'professor' | 'responsavel' | 'aluno' | 'secretaria';
}

// CORREÇÃO: O componente agora espera receber a propriedade 'profile', e não 'userRole'.
const SecretariaDashboard: React.FC<{ profile: Profile }> = ({ profile }) => {

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-foreground">Painel da Secretaria</h1>
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4 text-card-foreground">Registo de Frequência</h2>
        {/* CORREÇÃO: Passamos a propriedade 'profile' para o componente Frequencia. */}
        <Frequencia profile={profile} />
      </div>
    </div>
  );
};

export default SecretariaDashboard;
