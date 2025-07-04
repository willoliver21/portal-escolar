import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useNotification } from './NotificationContext';
import { LayoutWithSidebar } from './components/layout-with-sidebar';

interface Nota { materia: string; nota: number; data: string; }
interface Frequencia { data: string; status: 'presente' | 'falta' | 'atestado' | 'ausente'; }
interface AlunoData { aluno_nome: string; notas: Nota[]; frequencias: Frequencia[]; }
interface AlunoInfo { aluno_id: string; aluno_nome: string; }

export function ResponsavelDashboard() {
  const { showToast } = useNotification();
  const [alunoData, setAlunoData] = useState<AlunoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlunoData() {
      setLoading(true);
      const { data: alunoInfo, error: alunoInfoError } = await supabase.rpc('get_meu_aluno_info').single();
      if (alunoInfoError || !alunoInfo) { setLoading(false); return; }
      
      const { aluno_id, aluno_nome } = alunoInfo as AlunoInfo;

      const [notasResult, frequenciasResult] = await Promise.all([
        supabase.from('notas').select('materia, nota, data').eq('aluno_id', aluno_id),
        supabase.from('frequencias').select('data, status').eq('aluno_id', aluno_id)
      ]);
      
      if (notasResult.error || frequenciasResult.error) {
        showToast('Erro ao buscar detalhes do aluno.', 'error');
      } else {
        setAlunoData({
          aluno_nome: aluno_nome,
          notas: notasResult.data || [],
          frequencias: frequenciasResult.data || []
        });
      }
      setLoading(false);
    }
    fetchAlunoData();
  }, [showToast]);

  const breadcrumbs = [
    { title: "Dashboard", url: "/responsavel-dashboard" },
    { title: "Responsável" }
  ];

  if (loading) {
    return (
      <LayoutWithSidebar 
        userType="responsavel" 
        currentPath="/responsavel-dashboard"
        breadcrumbs={breadcrumbs}
      >
        <div className="flex items-center justify-center h-64">
          <p>A carregar informações do aluno...</p>
        </div>
      </LayoutWithSidebar>
    );
  }

  if (!alunoData) {
    return (
      <LayoutWithSidebar 
        userType="responsavel" 
        currentPath="/responsavel-dashboard"
        breadcrumbs={breadcrumbs}
      >
        <p className="p-4 bg-yellow-900/50 border border-yellow-700 rounded-md text-yellow-200">
          Não foi possível encontrar os dados do aluno.
        </p>
      </LayoutWithSidebar>
    );
  }
  
  const totalFaltas = alunoData.frequencias.filter(f => f.status === 'falta' || f.status === 'ausente').length;
  const mediaGeral = alunoData.notas.length > 0 ? (alunoData.notas.reduce((acc, n) => acc + n.nota, 0) / alunoData.notas.length).toFixed(1) : 'N/A';
  const statusMap = {
    presente: { text: 'Presente', color: 'text-green-400' },
    falta: { text: 'Falta', color: 'text-red-400' },
    atestado: { text: 'Atestado', color: 'text-blue-400' },
    ausente: { text: 'Ausente', color: 'text-yellow-400' },
  };

  return (
    <LayoutWithSidebar 
      userType="responsavel" 
      currentPath="/responsavel-dashboard"
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Painel do Aluno</h2>
          <p className="text-muted-foreground mt-1">Acompanhe aqui o desempenho de <strong>{alunoData.aluno_nome}</strong>.</p>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <h4 className="text-gray-400 font-medium mb-2">Média Geral</h4>
          <p className="text-4xl font-bold text-white">{mediaGeral}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <h4 className="text-gray-400 font-medium mb-2">Total de Faltas</h4>
          <p className="text-4xl font-bold text-white">{totalFaltas}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h3 className="font-semibold mb-4 text-lg text-white">Últimas Notas</h3>
          <ul className="space-y-2">
            {alunoData.notas.slice(0, 5).map((nota, index) => (
              <li key={index} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-700/50">
                <div>
                   <span className="font-medium text-gray-200">{nota.materia}</span>
                   <span className="text-xs text-gray-400 block">{new Date(nota.data + 'T00:00:00').toLocaleDateString()}</span>
                </div>
                <span className={`px-2 py-1 text-sm font-bold rounded-md ${nota.nota >= 6 ? 'bg-green-800/50 text-green-300' : 'bg-red-800/50 text-red-300'}`}>{nota.nota.toFixed(1)}</span>
              </li>
            ))}
            {alunoData.notas.length === 0 && <p className="text-gray-400 text-sm">Nenhuma nota lançada.</p>}
          </ul>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h3 className="font-semibold mb-4 text-lg text-white">Últimas Frequências</h3>
          <ul className="space-y-2">
            {alunoData.frequencias.slice(0, 5).map((freq, index) => (
              <li key={index} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-700/50">
                <span className="font-medium text-gray-200">{new Date(freq.data + 'T00:00:00').toLocaleDateString()}</span>
                <span className={`font-semibold ${statusMap[freq.status]?.color || 'text-gray-400'}`}>
                  {statusMap[freq.status]?.text || 'Indefinido'}
                </span>
              </li>
            ))}
             {alunoData.frequencias.length === 0 && <p className="text-gray-400 text-sm">Nenhum registo de frequência.</p>}
          </ul>
        </div>
      </div>
      </div>
    </LayoutWithSidebar>
  );
}
