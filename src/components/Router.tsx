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
  const getRoutes = (): Record<string, React.ReactElement> => {
    const baseRoutes: Record<string, React.ReactElement> = {
      '/configuracoes': <div>Configurações (Em desenvolvimento)</div>,
    };

    switch (profile.role) {
      case 'admin':
        return {
          ...baseRoutes,
          '/admin-dashboard': <AdminDashboard />,
          '/admin/usuarios': <div>Usuários (Em desenvolvimento)</div>,
          '/admin/turmas': <div>Turmas (Em desenvolvimento)</div>,
          '/admin/professores': <div>Professores (Em desenvolvimento)</div>,
          '/admin/relatorios/frequencia': <FrequenciaPage />,
          '/admin/relatorios/notas': <Notas />,
        };
      
      case 'professor':
        return {
          ...baseRoutes,
          '/dashboard': <Dashboard />,
          '/turmas': <div>Turmas (Em desenvolvimento)</div>,
          '/frequencia': <FrequenciaPage />,
          '/notas': <Notas />,
          '/disciplinas': <div>Disciplinas (Em desenvolvimento)</div>,
        };
      
      case 'secretaria':
        return {
          ...baseRoutes,
          '/secretaria-dashboard': <SecretariaDashboard profile={profile} />,
          '/secretaria': <Secretaria />,
          '/secretaria/alunos': <Secretaria />,
          '/secretaria/matriculas': <div>Matrículas (Em desenvolvimento)</div>,
          '/secretaria/relatorios': <div>Relatórios (Em desenvolvimento)</div>,
        };
      
      case 'responsavel':
      case 'aluno':
        return {
          ...baseRoutes,
          '/responsavel-dashboard': <ResponsavelDashboard />,
          '/responsavel/calendario': <div>Calendário (Em desenvolvimento)</div>,
          '/responsavel/boletim': <div>Boletim (Em desenvolvimento)</div>,
          '/responsavel/frequencia': <div>Frequência (Em desenvolvimento)</div>,
        };
      
      default:
        return {
          ...baseRoutes,
          '/dashboard': <div>Bem-vindo!</div>,
        };
    }
  };

  const routes = getRoutes();
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
