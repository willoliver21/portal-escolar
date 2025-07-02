import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Auth } from './Auth';
import { AppLayout } from '@/components/layout'; // Importar o novo layout
import { Dashboard } from './Dashboard';
import { AdminDashboard } from './AdminDashboard';
import { ResponsavelDashboard } from './ResponsavelDashboard';
import { Secretaria } from './Secretaria';
import { Toast } from './Toast';
import { NotificationContext } from './NotificationContext';

// Interfaces
interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'professor' | 'responsavel' | 'aluno' | 'secretaria';
}
interface ToastState {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

// Componente Principal
export default function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false });

  // Funções de Notificação
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, visible: true });
  };
  const closeToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  // Efeitos para autenticação, perfil e toast
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => closeToast(), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      return;
    }
    const fetchProfile = async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (error) {
        console.error('Erro ao buscar perfil:', error.message);
        setProfile(null);
      } else {
        setProfile(data);
      }
      setIsLoading(false);
    };
    setIsLoading(true);
    fetchProfile();
  }, [session]);

  // Função para renderizar o dashboard correto com base no perfil
  const renderDashboard = () => {
    if (!profile) return null;

    switch (profile.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'professor':
        return <Dashboard />;
      case 'responsavel':
      case 'aluno':
        return <ResponsavelDashboard />;
      case 'secretaria':
        return <Secretaria />;
      default:
        return <div>Bem-vindo!</div>;
    }
  };

  // Renderização do App
  return (
    <NotificationContext.Provider value={{ showToast }}>
      {isLoading && <div className="fixed inset-0 bg-background flex items-center justify-center z-50"><p>A carregar...</p></div>}
      {!session && !isLoading ? <Auth /> : (
        <AppLayout>
          {profile && renderDashboard()}
        </AppLayout>
      )}
      {toast.visible && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </NotificationContext.Provider>
  );
}
