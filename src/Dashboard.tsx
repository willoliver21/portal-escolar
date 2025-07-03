import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useNotification } from './NotificationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LayoutWithSidebar } from './components/layout-with-sidebar';

interface PresencaData {
  nome: string;
  presenca: number;
}

export function Dashboard() {
  const { showToast } = useNotification();
  const [presencaData, setPresencaData] = useState<PresencaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_dashboard_presenca');
      if (error) {
        showToast('Erro ao buscar dados para o dashboard.', 'error');
      } else {
        setPresencaData(data || []);
      }
      setLoading(false);
    }
    fetchDashboardData();
  }, [showToast]);

  const breadcrumbs = [
    { title: "Dashboard", url: "/dashboard" },
    { title: "Professor" }
  ];

  if (loading) {
    return (
      <LayoutWithSidebar 
        userType="professor" 
        currentPath="/dashboard"
        breadcrumbs={breadcrumbs}
      >
        <div className="flex items-center justify-center h-64">
          <p>A carregar dados do dashboard...</p>
        </div>
      </LayoutWithSidebar>
    );
  }

  return (
    <LayoutWithSidebar 
      userType="professor" 
      currentPath="/dashboard"
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard do Professor</h2>
          <p className="text-muted-foreground mt-1">Visão geral do desempenho dos seus alunos.</p>
        </div>
        
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-4 text-lg">Percentual de Presença dos Alunos</h3>
          {presencaData.length > 0 ? (
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
          ) : (
            <p className="text-muted-foreground">Não há dados de presença para exibir.</p>
          )}
        </div>
      </div>
    </LayoutWithSidebar>
  );
}
