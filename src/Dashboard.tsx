import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// Interface para descrever o formato dos dados que nossa função SQL retorna.
interface DadosGrafico {
  nome: string
  presenca: number
}

export function Dashboard() {
  // Estado para armazenar os dados já processados que vêm do Supabase.
  const [dadosGrafico, setDadosGrafico] = useState<DadosGrafico[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDadosDashboard() {
      setLoading(true)
      setError(null)

      // Chamamos nossa função 'get_dashboard_presenca' usando rpc().
      // É muito mais eficiente!
      const { data, error } = await supabase.rpc('get_dashboard_presenca')

      if (error) {
        console.error('Erro ao buscar dados do dashboard:', error)
        setError('Não foi possível carregar os dados do dashboard.')
      } else {
        // Os dados já vêm no formato que precisamos!
        setDadosGrafico(data || [])
      }

      setLoading(false)
    }

    fetchDadosDashboard()
  }, []) // O array de dependências vazio garante que isso rode apenas uma vez.

  if (loading) {
    return <p>Carregando dados do dashboard...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2>Dashboard - Percentual de Presença por Aluno</h2>
      <ResponsiveContainer>
        <BarChart
          data={dadosGrafico}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" />
          <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
          <Legend />
          <Bar dataKey="presenca" fill="#8884d8" name="Presença (%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
