import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useNotification } from './NotificationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AdminStats {
  total_alunos: number;
  total_turmas: number;
}
interface PresencaData {
  nome: string;
  presenca: number;
}

export function AdminDashboard() {
  const { showToast } = useNotification();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [presencaData, setPresencaData] = useState<PresencaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminData() {
      setLoading(true);
      const [statsResult, presencaResult] = await Promise.all([
        supabase.rpc('get_admin_stats').single(),
        supabase.rpc('get_dashboard_presenca')
      ]);

      if (statsResult.error) {
        showToast('Erro ao buscar estatísticas do admin.', 'error');
      } else {
        setStats(statsResult.data as AdminStats | null);
      }

      if (presencaResult.error) {
        showToast('Erro ao buscar dados de presença.', 'error');
      } else {
        setPresencaData(presencaResult.data || []);
      }
      setLoading(false);
    }
    fetchAdminData();
  }, [showToast]);

  if (loading) return <p>A carregar o dashboard do administrador...</p>;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard do Administrador</h2>
        <p className="text-gray-300 mt-1">Visão geral da saúde acadêmica da escola.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/20 border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <h4 className="text-gray-300 font-medium mb-2">Total de Alunos</h4>
          <p className="text-4xl font-bold text-white">{stats?.total_alunos ?? 0}</p>
        </div>
        <div className="bg-black/20 border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <h4 className="text-gray-300 font-medium mb-2">Total de Turmas</h4>
          <p className="text-4xl font-bold text-white">{stats?.total_turmas ?? 0}</p>
        </div>
      </div>
      <div className="bg-black/20 border border-white/10 rounded-lg p-6">
        <h3 className="font-semibold mb-4 text-lg text-white">Percentual de Presença Geral</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={presencaData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
              <XAxis dataKey="nome" stroke="#d1d5db" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#d1d5db" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(20, 20, 30, 0.8)', 
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  color: '#e2e8f0',
                  borderRadius: '0.5rem'
                }} 
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Presença']} 
              />
              <Legend wrapperStyle={{ fontSize: '14px', color: '#d1d5db' }} />
              <Bar dataKey="presenca" fill="rgba(66, 153, 225, 0.8)" name="Presença (%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
