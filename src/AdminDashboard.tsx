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

// Interfaces para os nossos dados
interface AdminStats {
  total_alunos: number;
  total_turmas: number;
}

interface PresencaData {
  nome: string;
  presenca: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [presencaData, setPresencaData] = useState<PresencaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminData() {
      setLoading(true);

      // Usamos Promise.all para buscar os dados em paralelo, o que é mais rápido.
      const [statsResult, presencaResult] = await Promise.all([
        supabase.rpc('get_admin_stats').single(),
        supabase.rpc('get_dashboard_presenca')
      ]);

      if (statsResult.error) {
        console.error('Erro ao buscar estatísticas do admin:', statsResult.error);
      } else {
        setStats(statsResult.data);
      }

      if (presencaResult.error) {
        console.error('Erro ao buscar dados de presença:', presencaResult.error);
      } else {
        setPresencaData(presencaResult.data || []);
      }

      setLoading(false);
    }

    fetchAdminData();
  }, []);

  if (loading) {
    return <p>A carregar o dashboard do administrador...</p>;
  }

  return (
    <div>
      <h2>Dashboard do Administrador</h2>

      {/* Secção de Estatísticas Rápidas (KPIs) */}
      <div className="stats-container">
        <div className="stat-card">
          <h4>Total de Alunos</h4>
          <p>{stats?.total_alunos ?? 0}</p>
        </div>
        <div className="stat-card">
          <h4>Total de Turmas</h4>
          <p>{stats?.total_turmas ?? 0}</p>
        </div>
      </div>

      {/* Secção de Gráficos */}
      <div style={{ marginTop: '40px' }}>
        <h3>Percentual de Presença Geral</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={presencaData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
      </div>
    </div>
  );
}
