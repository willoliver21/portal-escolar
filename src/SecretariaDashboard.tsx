// src/SecretariaDashboard.tsx
import React from 'react';
import { Frequencia } from './Frequencia';


const SecretariaDashboard: React.FC<{ userRole: string }> = ({ userRole }) => {

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Painel da Secretaria</h1>
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Registo de Frequência</h2>
        <Frequencia userRole={userRole} />
      </div>
    </div>
  );
};

export default SecretariaDashboard;
