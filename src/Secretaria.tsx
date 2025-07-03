import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useNotification } from './NotificationContext';
import { LayoutWithSidebar } from './components/layout-with-sidebar';

interface Aluno { id: string; nome: string; }
interface Turma { id: string; nome: string; }

export function Secretaria() {
  const { showToast } = useNotification();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>('');
  const [loadingTurmas, setLoadingTurmas] = useState(true);
  const [loadingAlunos, setLoadingAlunos] = useState(false);

  useEffect(() => {
    async function fetchTurmas() {
      setLoadingTurmas(true);
      const { data, error } = await supabase.from('turmas').select('id, nome').order('nome');
      if (error) showToast('Erro ao carregar a lista de turmas.', 'error');
      else setTurmas(data || []);
      setLoadingTurmas(false);
    }
    fetchTurmas();
  }, [showToast]);

  useEffect(() => {
    if (!selectedTurmaId) { setAlunos([]); return; }
    async function fetchAlunosDaTurma() {
      setLoadingAlunos(true);
      const { data: matriculas, error: matriculasError } = await supabase.from('matriculas').select('aluno_id').eq('turma_id', selectedTurmaId);
      if (matriculasError || !matriculas || matriculas.length === 0) {
        setAlunos([]);
        setLoadingAlunos(false);
        if (matriculasError) console.error('Erro ao buscar matrículas:', matriculasError);
        return;
      }
      const alunoIds = matriculas.map(m => m.aluno_id);
      const { data: alunosData, error: alunosError } = await supabase.from('alunos').select('id, nome').in('id', alunoIds).order('nome');
      if (alunosError) showToast('Falha ao carregar os alunos.', 'error');
      else setAlunos(alunosData || []);
      setLoadingAlunos(false);
    }
    fetchAlunosDaTurma();
  }, [selectedTurmaId, showToast]);

  const breadcrumbs = [
    { title: "Dashboard", url: "/secretaria" },
    { title: "Secretaria" }
  ];

  if (loadingTurmas) {
    return (
      <LayoutWithSidebar 
        userType="secretaria" 
        currentPath="/secretaria"
        breadcrumbs={breadcrumbs}
      >
        <div className="flex items-center justify-center h-64">
          <p>A carregar dados da escola...</p>
        </div>
      </LayoutWithSidebar>
    );
  }

  return (
    <LayoutWithSidebar 
      userType="secretaria" 
      currentPath="/secretaria"
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Painel da Secretaria</h2>
          <p className="text-muted-foreground mt-1">Gestão de alunos e turmas da escola.</p>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
          <div>
            <label htmlFor="turma-select-secretaria" className="block text-sm font-medium text-gray-400 mb-1">
              Selecione uma Turma para ver os Alunos
            </label>
            <select id="turma-select-secretaria" value={selectedTurmaId} onChange={e => setSelectedTurmaId(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Todas as Turmas ({turmas.length}) --</option>
              {turmas.map(turma => (
                <option key={turma.id} value={turma.id}>{turma.nome}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h3 className="font-semibold mb-4 text-lg text-white">
            {selectedTurmaId ? `Alunos na Turma (${alunos.length})` : 'Selecione uma turma'}
          </h3>
          {loadingAlunos ? <p>A carregar...</p> : (
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {alunos.map(aluno => (
                <li key={aluno.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-700/50">
                  <span className="text-gray-200">{aluno.nome}</span>
                </li>
              ))}
              {!selectedTurmaId && <p className="text-gray-400 text-sm">Os alunos da turma selecionada aparecerão aqui.</p>}
            </ul>
          )}
        </div>
      </div>
      </div>
    </LayoutWithSidebar>
  );
}
