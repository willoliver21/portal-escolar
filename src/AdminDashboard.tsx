import { useEffect, useState } from 'react'; // 'React' removido
import { supabase } from './supabaseClient';
import { useNotification } from './NotificationContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Interfaces
interface AdminStats {
  total_alunos: number;
  total_turmas: number;
}
interface PresencaData {
  nome: string;
  presenca: number;
}

// Componente
export function AdminDashboard() {
  const { showToast } = useNotification();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [presencaData, setPresencaData] = useState<PresencaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminData() {
      setLoading(true);
      const [statsResult, presencaResult] = await Promise.all([
        // CORREÇÃO: Informamos ao Supabase o tipo de retorno esperado
        supabase.rpc<AdminStats>('get_admin_stats').single(),
        supabase.rpc<PresencaData[]>('get_dashboard_presenca')
      ]);

      if (statsResult.error) {
        showToast('Erro ao buscar estatísticas do admin.', 'error');
      } else {
        // Agora o 'statsResult.data' é do tipo AdminStats | null, o que é seguro.
        setStats(statsResult.data);
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

  // ... o resto do componente continua igual ...
  if (loading) {
    return <p>A carregar o dashboard do administrador...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard do Administrador</h2>
        <p className="text-gray-400 mt-1">Visão geral da saúde acadêmica da escola.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <h4 className="text-gray-400 font-medium mb-2">Total de Alunos</h4>
          <p className="text-4xl font-bold text-white">{stats?.total_alunos ?? 0}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <h4 className="text-gray-400 font-medium mb-2">Total de Turmas</h4>
          <p className="text-4xl font-bold text-white">{stats?.total_turmas ?? 0}</p>
        </div>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="font-semibold mb-4 text-lg text-white">Percentual de Presença Geral</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={presencaData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="nome" stroke="#a0aec0" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a0aec0" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
              <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568', color: '#e2e8f0' }} formatter={(value: number) => [`${value.toFixed(1)}%`, 'Presença']} />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Bar dataKey="presenca" fill="#4299E1" name="Presença (%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
