import React, { useState } from 'react'
import { supabase } from './supabaseClient'
import schoolIllustration from './assets/react.svg' // Placeholder: substitua pela ilustração desejada

export function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false) // Estado para a checkbox
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      setError("Email ou senha inválidos. Por favor, tente novamente.")
    }
    setLoading(false)
  }

  return (
    // Container principal com o fundo em gradiente
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-300 via-cyan-500 to-blue-700 p-4">
      
      <div className="flex w-full max-w-4xl bg-gray-900/20 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100/20">
        
        {/* Lado esquerdo: Ilustração */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-12">
          {/* Pode substituir este SVG por uma imagem mais adequada */}
          <img src={schoolIllustration} alt="Ilustração Escolar" className="w-full h-auto max-w-sm" />
        </div>

        {/* Lado direito: Formulário */}
        <div className="w-full md:w-1/2 p-8 space-y-6 text-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Student Login Form</h1>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <input
                id="email"
                className="w-full px-4 py-3 bg-gray-900/50 border border-transparent rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <input
                id="password"
                className="w-full px-4 py-3 bg-gray-900/50 border border-transparent rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-500 bg-gray-800 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300 cursor-pointer">
                Remember me
              </label>
            </div>

            {error && <p className="text-sm text-red-300 bg-red-900/50 p-3 rounded-lg text-center">{error}</p>}

            <button 
              className="w-full px-4 py-3 font-bold text-white uppercase bg-black rounded-lg hover:bg-gray-800 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors" 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'A entrar...' : 'Login'}
            </button>
          </form>

          <p className="text-xs text-center text-gray-300 pt-6">
            © 2024 Portal Escolar. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
