import React from 'react';
import { Dashboard } from '../Dashboard';
import { AdminDashboard } from '../AdminDashboard';
import { ResponsavelDashboard } from '../ResponsavelDashboard';
import { Secretaria } from '../Secretaria';
import { Notas } from '../Notas';
import { FrequenciaPage } from '../FrequenciaPage';
import SecretariaDashboard from '../SecretariaDashboard';
import { useNavigation } from '../contexts/NavigationContext';

interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'professor' | 'responsavel' | 'aluno' | 'secretaria';
}

interface RouterProps {
  profile: Profile;
}

export function Router({ profile }: RouterProps) {
  const { currentPage } = useNavigation();

  // Rotas por tipo de usuário
  const getRoutes = () => {
    switch (profile.role) {
      case 'admin':
        return {
          '/admin-dashboard': <AdminDashboard />,
          '/admin/usuarios': <div>Usuários (Em desenvolvimento)</div>,
          '/admin/turmas': <div>Turmas (Em desenvolvimento)</div>,
          '/admin/professores': <div>Professores (Em desenvolvimento)</div>,
          '/admin/relatorios/frequencia': <FrequenciaPage />,
          '/admin/relatorios/notas': <Notas />,
          '/configuracoes': <div>Configurações (Em desenvolvimento)</div>,
        };
      
      case 'professor':
        return {
          '/dashboard': <Dashboard />,
          '/turmas': <div>Turmas (Em desenvolvimento)</div>,
          '/frequencia': <FrequenciaPage />,
          '/notas': <Notas />,
          '/disciplinas': <div>Disciplinas (Em desenvolvimento)</div>,
          '/configuracoes': <div>Configurações (Em desenvolvimento)</div>,
        };
      
      case 'secretaria':
        return {
          '/secretaria-dashboard': <SecretariaDashboard profile={profile} />,
          '/secretaria': <Secretaria />,
          '/secretaria/alunos': <Secretaria />,
          '/secretaria/matriculas': <div>Matrículas (Em desenvolvimento)</div>,
          '/secretaria/relatorios': <div>Relatórios (Em desenvolvimento)</div>,
          '/configuracoes': <div>Configurações (Em desenvolvimento)</div>,
        };
      
      case 'responsavel':
      case 'aluno':
        return {
          '/responsavel-dashboard': <ResponsavelDashboard />,
          '/responsavel/calendario': <div>Calendário (Em desenvolvimento)</div>,
          '/responsavel/boletim': <div>Boletim (Em desenvolvimento)</div>,
          '/responsavel/frequencia': <div>Frequência (Em desenvolvimento)</div>,
          '/configuracoes': <div>Configurações (Em desenvolvimento)</div>,
        };
      
      default:
        return {
          '/dashboard': <div>Bem-vindo!</div>,
        };
    }
  };

  const routes = getRoutes() as Record<string, React.ReactElement>;
  const currentComponent = routes[currentPage] || getDefaultRoute();

  function getDefaultRoute() {
    switch (profile.role) {
      case 'admin':
        return routes['/admin-dashboard'];
      case 'professor':
        return routes['/dashboard'];
      case 'secretaria':
        return routes['/secretaria-dashboard'];
      case 'responsavel':
      case 'aluno':
        return routes['/responsavel-dashboard'];
      default:
        return <div>Página não encontrada</div>;
    }
  }

  return <>{currentComponent}</>;
}
