import React, { useEffect, useState } from 'react'; // CORREÇÃO: Adicionada a importação do React
import { supabase } from './supabaseClient';
import { useNotification } from './NotificationContext';

// ... (o resto do ficheiro continua igual) ...
interface Turma { id: string; nome: string; }
interface Aluno { id: string; nome: string; }

export function Frequencia() {
    const { showToast } = useNotification();
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [selectedTurmaId, setSelectedTurmaId] = useState<string>('');
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [frequencias, setFrequencias] = useState<Record<string, boolean>>({});
    const [dataSelecionada, setDataSelecionada] = useState(() => new Date().toISOString().slice(0, 10));
    const [loadingTurmas, setLoadingTurmas] = useState(true);
    const [loadingAlunos, setLoadingAlunos] = useState(false);
  
    useEffect(() => {
      async function fetchTurmas() {
        setLoadingTurmas(true);
        const { data, error } = await supabase.rpc('get_minhas_turmas');
        if (error) {
          showToast('Falha ao carregar as turmas.', 'error');
        } else {
          setTurmas(data || []);
        }
        setLoadingTurmas(false);
      }
      fetchTurmas();
    }, [showToast]);
  
    useEffect(() => {
      if (!selectedTurmaId) {
        setAlunos([]);
        return;
      }
      async function fetchAlunosDaTurma() {
        setLoadingAlunos(true);
        const { data, error } = await supabase
          .from('matriculas')
          .select('alunos ( id, nome )')
          .eq('turma_id', selectedTurmaId)
          .order('nome', { referencedTable: 'alunos' });
        
        if (error) {
          console.error('Erro ao buscar alunos da turma:', error);
        } else if (data) {
          // CORREÇÃO: A conversão agora é segura.
          const alunosDaTurma = data.map(item => item.alunos).filter((a): a is Aluno => !!a);
          setAlunos(alunosDaTurma);
        }
        setLoadingAlunos(false);
      }
      fetchAlunosDaTurma();
    }, [selectedTurmaId]);
    
    // ... o resto do componente continua igual ...
    useEffect(() => {
      async function fetchFrequencias() {
        if (!dataSelecionada || alunos.length === 0) {
          setFrequencias({});
          return;
        }
        const alunoIds = alunos.map(a => a.id);
        const { data, error } = await supabase.from('frequencias').select('aluno_id, presente').eq('data', dataSelecionada).in('aluno_id', alunoIds);
        if (error) {
          console.error('Erro ao buscar frequências:', error);
        } else {
          const freqMap = data.reduce((acc, f) => { acc[f.aluno_id] = f.presente; return acc; }, {} as Record<string, boolean>);
          setFrequencias(freqMap);
        }
      }
      fetchFrequencias();
    }, [dataSelecionada, alunos]);
    
    async function togglePresenca(alunoId: string) {
      const presenteAtual = frequencias[alunoId] ?? false;
      const novoStatus = !presenteAtual;
      setFrequencias(prev => ({ ...prev, [alunoId]: novoStatus }));
      const { error } = await supabase.from('frequencias').upsert({ aluno_id: alunoId, data: dataSelecionada, presente: novoStatus }, { onConflict: 'aluno_id, data' });
      if (error) {
        console.error('Erro ao salvar frequência:', error);
        setFrequencias(prev => ({ ...prev, [alunoId]: presenteAtual }));
        showToast('Erro ao salvar frequência.', 'error');
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
                      {alunos.map(aluno => (
                        <li key={aluno.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-700/50">
                          <span className="text-gray-200">{aluno.nome}</span>
                          <label className="flex items-center space-x-2 cursor-pointer">
                             <span className={`text-sm ${frequencias[aluno.id] ? 'text-green-400' : 'text-gray-400'}`}>Presente</span>
                             <div className="relative">
                                <input type="checkbox" className="sr-only" checked={frequencias[aluno.id] || false} onChange={() => togglePresenca(aluno.id)} />
                                <div className={`block w-10 h-6 rounded-full ${frequencias[aluno.id] ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${frequencias[aluno.id] ? 'transform translate-x-4' : ''}`}></div>
                             </div>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="p-4 bg-yellow-900/50 border border-yellow-700 rounded-md text-yellow-200">Não existem turmas associadas a si. Por favor, contacte um administrador.</p>
          )
        )}
      </div>
    );
}
