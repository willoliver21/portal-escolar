import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useNotification } from './NotificationContext';

interface Turma { id: string; nome: string; }
interface Aluno { id: string; nome: string; }
type StatusFrequencia = 'presente' | 'falta' | 'atestado' | 'ausente';
interface Profile { id: string; full_name: string; role: 'admin' | 'professor' | 'responsavel' | 'aluno' | 'secretaria'; }

export function Frequencia({ profile }: { profile: Profile }) {
  const { showToast } = useNotification();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>('');
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [frequencias, setFrequencias] = useState<Record<string, StatusFrequencia>>({});
  const [dataSelecionada, setDataSelecionada] = useState(() => new Date().toISOString().slice(0, 10));
  const [loadingTurmas, setLoadingTurmas] = useState(true);
  const [loadingAlunos, setLoadingAlunos] = useState(false);

  const statusOptions: StatusFrequencia[] = profile.role === 'professor' ? ['presente', 'falta'] : ['presente', 'falta', 'atestado', 'ausente'];
  const statusStyles: Record<StatusFrequencia, string> = {
    presente: 'bg-green-800/50 text-green-300',
    falta: 'bg-red-800/50 text-red-300',
    atestado: 'bg-blue-800/50 text-blue-300',
    ausente: 'bg-yellow-800/50 text-yellow-300',
  };

  useEffect(() => {
    async function fetchTurmas() {
      setLoadingTurmas(true);
      const rpcCall = (profile.role === 'admin' || profile.role === 'secretaria') ? 'get_todas_as_turmas' : 'get_minhas_turmas';
      const { data, error } = await supabase.rpc(rpcCall);
      if (error) showToast('Falha ao carregar as turmas.', 'error');
      else setTurmas(data || []);
      setLoadingTurmas(false);
    }
    fetchTurmas();
  }, [showToast, profile.role]);

  useEffect(() => {
    if (!selectedTurmaId) { setAlunos([]); return; }
    async function fetchAlunosDaTurma() {
      setLoadingAlunos(true);
      const { data, error } = await supabase.from('matriculas').select('alunos(id, nome)').eq('turma_id', selectedTurmaId).order('nome', { referencedTable: 'alunos' });
      if (error) console.error('Erro ao buscar alunos da turma:', error);
      else if (data) {
        // CORREÇÃO: Type guard robusto para garantir que o objeto 'alunos' não é nulo.
        const alunosDaTurma = data.map(item => item.alunos).filter((a): a is Aluno => a !== null && typeof a === 'object');
        setAlunos(alunosDaTurma);
      }
      setLoadingAlunos(false);
    }
    fetchAlunosDaTurma();
  }, [selectedTurmaId]);

  useEffect(() => {
    if (!dataSelecionada || alunos.length === 0) { setFrequencias({}); return; }
    async function fetchFrequencias() {
      const alunoIds = alunos.map(a => a.id);
      const { data, error } = await supabase.from('frequencias').select('aluno_id, status').eq('data', dataSelecionada).in('aluno_id', alunoIds);
      if (error) console.error('Erro ao buscar frequências:', error);
      else {
        const freqMap = data.reduce((acc, f) => { acc[f.aluno_id] = f.status; return acc; }, {} as Record<string, StatusFrequencia>);
        setFrequencias(freqMap);
      }
    }
    fetchFrequencias();
  }, [dataSelecionada, alunos]);

  async function handleStatusChange(alunoId: string, novoStatus: StatusFrequencia) {
    const statusAtual = frequencias[alunoId];
    setFrequencias(prev => ({ ...prev, [alunoId]: novoStatus }));
    const { error } = await supabase.from('frequencias').upsert({ aluno_id: alunoId, data: dataSelecionada, status: novoStatus }, { onConflict: 'aluno_id, data' });
    if (error) {
      console.error('Erro ao salvar frequência:', error);
      setFrequencias(prev => ({ ...prev, [alunoId]: statusAtual }));
      showToast('Erro ao salvar frequência: ' + error.message, 'error');
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Registo de Frequência</h2>
      {loadingTurmas ? <p>A carregar as suas turmas...</p> : (
        turmas.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="turma-select" className="block text-sm font-medium text-gray-400 mb-1">Turma</label>
                <select id="turma-select" value={selectedTurmaId} onChange={e => setSelectedTurmaId(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Selecione uma turma --</option>
                  {turmas.map(turma => <option key={turma.id} value={turma.id}>{turma.nome}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="data-select" className="block text-sm font-medium text-gray-400 mb-1">Data</label>
                <input id="data-select" type="date" value={dataSelecionada} onChange={e => setDataSelecionada(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            {selectedTurmaId && (
              loadingAlunos ? <p>A carregar alunos...</p> : (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 text-lg">Alunos</h3>
                  <ul className="space-y-2">
                    {alunos.map(aluno => {
                      const statusAtual = frequencias[aluno.id];
                      const isLocked = profile.role === 'professor' && (statusAtual === 'atestado' || statusAtual === 'ausente');
                      return (
                        <li key={aluno.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-700/50">
                          <span className={`text-gray-200 ${isLocked ? 'opacity-60' : ''}`}>{aluno.nome}</span>
                          {isLocked ? (
                            <span className={`px-3 py-1 text-sm font-bold rounded-md capitalize ${statusStyles[statusAtual]}`}>
                              {statusAtual}
                            </span>
                          ) : (
                            <select value={statusAtual || 'presente'} onChange={(e) => handleStatusChange(aluno.id, e.target.value as StatusFrequencia)} className={`px-3 py-1 bg-gray-700 border border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize`}>
                              {statusOptions.map(status => (
                                <option key={status} value={status} className="capitalize">{status}</option>
                              ))}
                            </select>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="p-4 bg-yellow-900/50 border border-yellow-700 rounded-md text-yellow-200">Não existem turmas para gerir.</p>
        )
      )}
    </div>
  );
}
