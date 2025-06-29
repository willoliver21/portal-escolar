import React, { useState, useEffect } from 'react'
import { Dashboard } from './Dashboard'
import { Auth } from './Auth'
import { Frequencia } from './Frequencia'
import { Notas } from './Notas'
import { supabase } from './supabaseClient'
import { AdminDashboard } from './AdminDashboard'
import { ResponsavelDashboard } from './ResponsavelDashboard';
import { Toast } from './Toast'; // <-- Importar o Toast
import { NotificationContext } from './NotificationContext'; // <-- Importar o Contexto
import './App.css';

interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'professor' | 'responsavel' | 'aluno';
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [page, setPage] = useState<'dashboard' | 'frequencia' | 'notas'>('dashboard');
  
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Estado para a notificação Toast
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false });

  // Função para mostrar o Toast, que será partilhada via Contexto
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, visible: true });
  };
  
  const closeToast = () => {
      setToast(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    // Definimos um temporizador para esconder o toast após 5 segundos
    if (toast.visible) {
      const timer = setTimeout(() => {
        closeToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsSessionLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      setIsProfileLoading(true);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error.message);
        setProfile(null);
      } else {
        setProfile(profileData);
      }
      setIsProfileLoading(false);
    };

    fetchProfile();
  }, [session]);

  const isLoading = isSessionLoading || isProfileLoading;

  // O componente App principal agora envolve tudo com o NotificationProvider
  return (
    <NotificationContext.Provider value={{ showToast }}>
      <div className="app-container">
        {isLoading && <div className="loading-overlay">A carregar...</div>}
        
        {/* Mostra Auth se não houver sessão, caso contrário, mostra a app principal */}
        {!session && !isLoading ? <Auth /> : (
          session && !isLoading && (
            <div className="container">
              <header className="app-header">
                <h1>Portal Escolar</h1>
                <div className="user-info">
                  <span>Olá, {profile?.full_name || session.user.email}</span>
                  <span className="user-role">({profile?.role})</span>
                  <button className="logout-button" onClick={() => supabase.auth.signOut()}>
                    Sair
                  </button>
                </div>
              </header>

              <nav className="app-nav">
                {/* Apenas Admins e Professores veem os botões de gestão */}
                {(profile?.role === 'admin' || profile?.role === 'professor') && (
                  <>
                    <button onClick={() => setPage('frequencia')}>Frequência</button>
                    <button onClick={() => setPage('notas')}>Notas</button>
                  </>
                )}
                {/* Todos os perfis veem o botão do dashboard */}
                <button onClick={() => setPage('dashboard')}>Dashboard</button>
              </nav>

              <main className="app-main">
                {page === 'dashboard' && profile?.role === 'admin' && <AdminDashboard />}
                {page === 'dashboard' && profile?.role === 'professor' && <Dashboard />}
                {/* Alunos e Responsáveis veem o mesmo dashboard */}
                {page === 'dashboard' && (profile?.role === 'responsavel' || profile?.role === 'aluno') && <ResponsavelDashboard />}

                {/* Apenas Admins e Professores acedem a estas páginas */}
                {page === 'frequencia' && (profile?.role === 'admin' || profile?.role === 'professor') && <Frequencia />}
                {page === 'notas' && (profile?.role === 'admin' || profile?.role === 'professor') && <Notas />}
              </main>
            </div>
          )
        )}

        {/* O componente Toast é renderizado aqui, no topo da aplicação */}
        {toast.visible && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      </div>
    </NotificationContext.Provider>
  );
}

// Estilos básicos para o overlay de loading e container da app. Adicione ao seu App.css
/*
.app-container {
  position: relative;
  min-height: 100vh;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  font-size: 1.5rem;
}
*/
