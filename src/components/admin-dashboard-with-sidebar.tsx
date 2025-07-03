import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNotification } from '../NotificationContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { LayoutWithSidebar } from './layout-with-sidebar'

interface AdminStats {
  total_alunos: number
  total_turmas: number
}

interface PresencaData {
  nome: string
  presenca: number
}

export function AdminDashboardWithSidebar() {
  const { showToast } = useNotification()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [presencaData, setPresencaData] = useState<PresencaData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAdminData() {
      setLoading(true)
      const [statsResult, presencaResult] = await Promise.all([
        supabase.rpc('get_admin_stats').single(),
        supabase.rpc('get_dashboard_presenca')
      ])

      if (statsResult.error) {
        showToast('Erro ao buscar estatísticas do admin.', 'error')
      } else {
        setStats(statsResult.data as AdminStats | null)
      }

      if (presencaResult.error) {
        showToast('Erro ao buscar dados de presença.', 'error')
      } else {
        setPresencaData(presencaResult.data || [])
      }
      setLoading(false)
    }
    fetchAdminData()
  }, [showToast])

  const breadcrumbs = [
    { title: "Dashboard", url: "/admin-dashboard" },
    { title: "Administrador" }
  ]

  if (loading) {
    return (
      <LayoutWithSidebar 
        userType="admin" 
        currentPath="/admin-dashboard"
        breadcrumbs={breadcrumbs}
      >
        <div className="flex items-center justify-center h-64">
          <p>A carregar o dashboard do administrador...</p>
        </div>
      </LayoutWithSidebar>
    )
  }
  
  return (
    <LayoutWithSidebar 
      userType="admin" 
      currentPath="/admin-dashboard"
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard do Administrador</h2>
          <p className="text-muted-foreground mt-1">
            Visão geral da saúde acadêmica da escola.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <h4 className="text-muted-foreground font-medium mb-2">Total de Alunos</h4>
            <p className="text-4xl font-bold">{stats?.total_alunos ?? 0}</p>
          </div>
          <div className="bg-card border rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <h4 className="text-muted-foreground font-medium mb-2">Total de Turmas</h4>
            <p className="text-4xl font-bold">{stats?.total_turmas ?? 0}</p>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-4 text-lg">Percentual de Presença Geral</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={presencaData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="nome" 
                  className="text-muted-foreground"
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  className="text-muted-foreground"
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}%`} 
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))', 
                    color: 'hsl(var(--popover-foreground))',
                    borderRadius: '0.5rem'
                  }} 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Presença']} 
                />
                <Legend className="text-muted-foreground" />
                <Bar 
                  dataKey="presenca" 
                  fill="hsl(var(--primary))" 
                  name="Presença (%)" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  )
}
