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

// Interface
interface PresencaData {
  nome: string;
  presenca: number;
}

// Componente
export function Dashboard() {
  const { showToast } = useNotification();
  const [presencaData, setPresencaData] = useState<PresencaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);

      // Esta função `get_dashboard_presenca` já é filtrada pela RLS,
      // mostrando apenas os dados relevantes para o professor que fez login.
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

  if (loading) {
    return <p>A carregar dados do dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard do Professor</h2>
        <p className="text-gray-400 mt-1">Visão geral do desempenho dos seus alunos.</p>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="font-semibold mb-4 text-lg text-white">Percentual de Presença dos Alunos</h3>
        {presencaData.length > 0 ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={presencaData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis dataKey="nome" stroke="#a0aec0" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a0aec0" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2d3748',
                    border: '1px solid #4a5568',
                    color: '#e2e8f0'
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Presença']}
                />
                <Legend wrapperStyle={{ fontSize: '14px' }} />
                <Bar dataKey="presenca" fill="#4299E1" name="Presença (%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-400">Não há dados de presença para exibir.</p>
        )}
      </div>
    </div>
  );
}
