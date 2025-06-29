import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Auth } from './Auth';
import { Dashboard } from './Dashboard';
import { AdminDashboard } from './AdminDashboard';
import { ResponsavelDashboard } from './ResponsavelDashboard';
import { Frequencia } from './Frequencia';
import { Notas } from './Notas';
import { Toast } from './Toast';
import { NotificationContext } from './NotificationContext';
// Importar os ícones que vamos usar
import { LayoutDashboard, CheckSquare, GraduationCap, LogOut } from 'lucide-react';

// Interfaces
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

// Componente Principal
export default function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [page, setPage] = useState<'dashboard' | 'frequencia' | 'notas'>('dashboard');
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
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
      setIsSessionLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      return;
    }
    const fetchProfile = async () => {
      setIsProfileLoading(true);
      const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (error) {
        console.error('Erro ao buscar perfil:', error.message);
        setProfile(null);
      } else {
        setProfile(data);
      }
      setIsProfileLoading(false);
    };
    fetchProfile();
  }, [session]);

  const isLoading = isSessionLoading || isProfileLoading;

  // Renderização do App
  return (
    <NotificationContext.Provider value={{ showToast }}>
      <div className="min-h-screen bg-gray-900 text-gray-200">
        {isLoading && <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50"><p>A carregar...</p></div>}
        
        {!session && !isLoading ? <Auth /> : (
          session && !isLoading && profile && (
            <div className="flex">
              {/* Barra Lateral de Navegação */}
              <aside className="w-64 bg-gray-800 p-4 border-r border-gray-700 flex flex-col h-screen">
                <div className="text-center py-4">
                  <h1 className="text-2xl font-bold text-white">Portal Escolar</h1>
                </div>
                <nav className="flex flex-col space-y-2 flex-grow mt-8">
                  <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={page === 'dashboard'} onClick={() => setPage('dashboard')} />
                  {(profile.role === 'admin' || profile.role === 'professor') && (
                    <>
                      <NavItem icon={<CheckSquare size={20} />} label="Frequência" active={page === 'frequencia'} onClick={() => setPage('frequencia')} />
                      <NavItem icon={<GraduationCap size={20} />} label="Notas" active={page === 'notas'} onClick={() => setPage('notas')} />
                    </>
                  )}
                </nav>
                <div className="mt-auto">
                   <div className="p-3 bg-gray-700/50 rounded-lg mb-4">
                      <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white">
                           {profile.full_name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase()}
                         </div>
                         <div>
                            <p className="font-semibold text-sm text-white">{profile.full_name}</p>
                            <p className="text-xs text-gray-400 capitalize">{profile.role}</p>
                         </div>
                      </div>
                   </div>
                   <button onClick={() => supabase.auth.signOut()} className="w-full flex items-center justify-center space-x-2 p-2 rounded-md text-sm text-red-300 bg-red-800/50 hover:bg-red-800/80 transition-colors">
                      <LogOut size={16} />
                      <span>Sair</span>
                   </button>
                </div>
              </aside>

              {/* Conteúdo Principal */}
              <main className="flex-1 p-6 md:p-8 overflow-y-auto h-screen">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                  {page === 'dashboard' && profile.role === 'admin' && <AdminDashboard />}
                  {page === 'dashboard' && profile.role === 'professor' && <Dashboard />}
                  {page === 'dashboard' && (profile.role === 'responsavel' || profile.role === 'aluno') && <ResponsavelDashboard />}
                  {page === 'frequencia' && <Frequencia />}
                  {page === 'notas' && <Notas />}
                </div>
              </main>
            </div>
          )
        )}
        {toast.visible && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      </div>
    </NotificationContext.Provider>
  );
}

// Componente Auxiliar para os Itens da Navegação
const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 p-3 rounded-lg text-sm font-medium transition-colors w-full text-left ${
      active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);
