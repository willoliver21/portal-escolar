import React, { useState, useEffect } from 'react'
import { Dashboard } from './Dashboard'
import { Auth } from './Auth'
import { Frequencia } from './Frequencia'
import { Notas } from './Notas'
import { supabase } from './supabaseClient'
import { AdminDashboard } from './AdminDashboard' // <-- Adicionar esta linha
import './App.css';

interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'professor' | 'responsavel' | 'aluno';
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [page, setPage] = useState<'dashboard' | 'frequencia' | 'notas'>('dashboard');
  
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

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

  if (isLoading) {
    return <div className="container">A carregar...</div>;
  }

  if (!session) {
    return <Auth />;
  }

  return (
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
        {(profile?.role === 'admin' || profile?.role === 'professor') && (
          <>
            <button onClick={() => setPage('frequencia')}>Frequência</button>
            <button onClick={() => setPage('notas')}>Notas</button>
          </>
        )}
        <button onClick={() => setPage('dashboard')}>Dashboard</button>
      </nav>

      <main className="app-main">
        {/* --- LÓGICA ATUALIZADA AQUI --- */}
        {page === 'dashboard' && profile?.role === 'admin' && <AdminDashboard />}
        {page === 'dashboard' && profile?.role !== 'admin' && <Dashboard />}

        {page === 'frequencia' && <Frequencia />}
        {page === 'notas' && <Notas />}
      </main>
    </div>
  );
}
