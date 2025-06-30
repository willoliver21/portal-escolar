import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useNotification } from './NotificationContext';

interface Turma { id: string; nome: string; }
interface Aluno { id: string; nome: string; }
interface Nota { id: string; materia: string; nota: number; data: string; }

export function Notas() {
    const { showToast } = useNotification();
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [selectedTurmaId, setSelectedTurmaId] = useState<string>('');
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [selectedAlunoId, setSelectedAlunoId] = useState<string>('');
    const [notas, setNotas] = useState<Nota[]>([]);
    const [materia, setMateria] = useState('');
    const [notaInput, setNotaInput] = useState('');
    const [dataSelecionada, setDataSelecionada] = useState(() => new Date().toISOString().slice(0, 10));
    const [loadingTurmas, setLoadingTurmas] = useState(true);
    const [loadingAlunos, setLoadingAlunos] = useState(false);
    const [loadingNotas, setLoadingNotas] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    useEffect(() => {
      async function fetchTurmas() {
        setLoadingTurmas(true);
        const { data, error } = await supabase.rpc('get_minhas_turmas');
        if (error) showToast('Falha ao carregar as turmas.', 'error');
        else setTurmas(data || []);
        setLoadingTurmas(false);
      }
      fetchTurmas();
    }, [showToast]);
  
    useEffect(() => {
      if (!selectedTurmaId) { setAlunos([]); setSelectedAlunoId(''); return; }
      async function fetchAlunosDaTurma() {
        setLoadingAlunos(true);
        setSelectedAlunoId('');
        const { data, error } = await supabase.from('matriculas').select('alunos(id, nome)').eq('turma_id', selectedTurmaId).order('nome', { referencedTable: 'alunos' });
        if (error) {
          showToast('Falha ao carregar os alunos.', 'error');
        } else if (data) {
          const alunosDaTurma = data.flatMap(item => item.alunos || []).filter(Boolean);
          setAlunos(alunosDaTurma as Aluno[]);
        }
        setLoadingAlunos(false);
      }
      fetchAlunosDaTurma();
    }, [selectedTurmaId, showToast]);
  
    useEffect(() => {
      if (!selectedAlunoId) { setNotas([]); return; }
      async function fetchNotasDoAluno() {
        setLoadingNotas(true);
        const { data, error } = await supabase.from('notas').select('*').eq('aluno_id', selectedAlunoId).order('data', { ascending: false });
        if (error) showToast('Falha ao carregar as notas.', 'error');
        else setNotas(data || []);
        setLoadingNotas(false);
      }
      fetchNotasDoAluno();
    }, [selectedAlunoId, showToast]);
    
    async function handleAdicionarNota(e: React.FormEvent) {
        e.preventDefault();
        if (!materia || !notaInput) { showToast('Por favor, preencha a matéria e a nota.', 'error'); return; }
        const valorNota = parseFloat(notaInput);
        if (isNaN(valorNota) || valorNota < 0 || valorNota > 10) { showToast('A nota deve ser um número entre 0 e 10.', 'error'); return; }
        setIsSubmitting(true);
        const { data: novaNota, error } = await supabase.from('notas').insert({ aluno_id: selectedAlunoId, materia, nota: valorNota, data: dataSelecionada }).select().single();
        if (error) showToast('Ocorreu um erro ao adicionar a nota.', 'error');
        else {
          showToast('Nota adicionada com sucesso!', 'success');
          setNotas(prevNotas => [novaNota, ...prevNotas]);
          setMateria('');
          setNotaInput('');
        }
        setIsSubmitting(false);
      }

    if (loadingTurmas) return <p>A carregar as suas turmas...</p>;

    return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Lançamento de Notas</h2>
          {turmas.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="turma-select-notas" className="block text-sm font-medium text-gray-400 mb-1">Turma</label>
                  <select id="turma-select-notas" value={selectedTurmaId} onChange={e => setSelectedTurmaId(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">-- Selecione uma turma --</option>
                    {turmas.map(turma => <option key={turma.id} value={turma.id}>{turma.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="aluno-select-notas" className="block text-sm font-medium text-gray-400 mb-1">Aluno</label>
                  <select id="aluno-select-notas" value={selectedAlunoId} onChange={e => setSelectedAlunoId(e.target.value)} disabled={loadingAlunos || !selectedTurmaId} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                    <option value="">{loadingAlunos ? 'A carregar...' : '-- Selecione um aluno --'}</option>
                    {alunos.map(aluno => <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>)}
                  </select>
                </div>
              </div>
              {selectedAlunoId && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold mb-4 text-lg">Lançar Nova Nota</h3>
                    <form onSubmit={handleAdicionarNota} className="space-y-4">
                      <input type="text" placeholder="Matéria" value={materia} onChange={e => setMateria(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="number" placeholder="Nota (0-10)" value={notaInput} onChange={e => setNotaInput(e.target.value)} step="0.1" min="0" max="10" required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="date" value={dataSelecionada} onChange={e => setDataSelecionada(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-600 transition-colors">
                        {isSubmitting ? 'A adicionar...' : 'Adicionar Nota'}
                      </button>
                    </form>
                  </div>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold mb-4 text-lg">Notas Lançadas</h3>
                    {loadingNotas ? <p>A carregar notas...</p> : (
                      <ul className="space-y-2">
                        {notas.length > 0 ? notas.map(nota => (
                          <li key={nota.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-700/50">
                            <div>
                               <span className="font-medium">{nota.materia}</span>
                               <span className="text-xs text-gray-400 block">{new Date(nota.data + 'T00:00:00').toLocaleDateString()}</span>
                            </div>
                            <span className={`px-2 py-1 text-sm font-bold rounded-md ${nota.nota >= 6 ? 'bg-green-800/50 text-green-300' : 'bg-red-800/50 text-red-300'}`}>{nota.nota.toFixed(1)}</span>
                          </li>
                        )) : <p className="text-gray-400 text-sm">Nenhuma nota lançada para este aluno ainda.</p>}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="p-4 bg-yellow-900/50 border border-yellow-700 rounded-md text-yellow-200">Não existem turmas associadas a si. Por favor, contacte um administrador.</p>
          )}
        </div>
    );
}
