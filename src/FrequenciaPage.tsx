import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Frequencia } from './Frequencia';
import { LayoutWithSidebar } from './components/layout-with-sidebar';

interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'professor' | 'responsavel' | 'aluno' | 'secretaria';
}

export function FrequenciaPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const breadcrumbs = [
    { title: "Dashboard", url: "/" },
    { title: "Frequência" }
  ];

  if (loading) {
    return (
      <LayoutWithSidebar
        userType="professor"
        currentPath="/frequencia"
        breadcrumbs={breadcrumbs}
      >
        <div className="flex items-center justify-center h-64">
          <p>A carregar...</p>
        </div>
      </LayoutWithSidebar>
    );
  }

  if (!profile) {
    return (
      <LayoutWithSidebar
        userType="professor"
        currentPath="/frequencia"
        breadcrumbs={breadcrumbs}
      >
        <div className="flex items-center justify-center h-64">
          <p>Erro ao carregar perfil do usuário.</p>
        </div>
      </LayoutWithSidebar>
    );
  }

  const userType = profile.role === 'aluno' ? 'responsavel' : profile.role as 'admin' | 'professor' | 'secretaria' | 'responsavel';

  return (
    <LayoutWithSidebar
      userType={userType}
      currentPath="/frequencia"
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Registo de Frequência</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie a frequência dos alunos nas suas turmas.
          </p>
        </div>
        
        <div className="bg-card border rounded-lg p-6">
          <Frequencia profile={profile} />
        </div>
      </div>
    </LayoutWithSidebar>
  );
}
