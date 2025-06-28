import React, { useState, useEffect } from 'react'
import { Dashboard } from './Dashboard'
import { Auth } from './Auth'
import { Frequencia } from './Frequencia'
import { Notas } from './Notas'
import { supabase } from './supabaseClient'

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [page, setPage] = useState<'auth' | 'frequencia' | 'notas' | 'dashboard'>('auth')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      if (data.session?.user) setPage('frequencia')
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setPage(session?.user ? 'frequencia' : 'auth')
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  if (!user) return <Auth />

  return (
    <div>
      <h1>Portal Escolar</h1>
      <p>Olá, {user.email}</p>
      <button onClick={() => supabase.auth.signOut()}>Sair</button>
      <hr />
      <nav>
        <button onClick={() => setPage('dashboard')}>Dashboard</button>
        <button onClick={() => setPage('frequencia')}>Frequência</button>
        <button onClick={() => setPage('notas')}>Notas</button>
      </nav>
      <main>
      {page === 'dashboard' && <Dashboard />}
        {page === 'frequencia' && <Frequencia />}
        {page === 'notas' && <Notas />}
      </main>
    </div>
  )
}
