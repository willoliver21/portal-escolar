import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

// Interfaces para os nossos tipos de dados
interface Turma {
  id: string;
  nome: string;
}

interface Aluno {
  id:string;
  nome: string;
}

interface Nota {
  id: string;
  aluno_id: string;
  materia: string;
  nota: number;
  data: string;
}

export function Notas() {
  // Estados para seleção e dados
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>('');
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [selectedAlunoId, setSelectedAlunoId] = useState<string>('');
  const [notas, setNotas] = useState<Nota[]>([]);

  // Estados para os formulários
  const [materia, setMateria] = useState('');
  const [notaInput, setNotaInput] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState(() => new Date().toISOString().slice(0, 10));

  // Estados de carregamento
  const [loadingTurmas, setLoadingTurmas] = useState(true);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const [loadingNotas, setLoadingNotas] = useState(false);

  // Efeito 1: Buscar as turmas do professor logado.
  useEffect(() => {
    async function fetchTurmas() {
      setLoadingTurmas(true);
      const { data, error } = await supabase.rpc('get_minhas_turmas');
      if (error) {
        console.error('Erro ao buscar turmas:', error);
      } else {
        setTurmas(data || []);
      }
      setLoadingTurmas(false);
    }
    fetchTurmas();
  }, []);

  // Efeito 2: Buscar os alunos sempre que uma turma for selecionada.
  useEffect(() => {
    // Limpa a lista de alunos e seleções se nenhuma turma estiver selecionada.
    if (!selectedTurmaId) {
      setAlunos([]);
      setSelectedAlunoId('');
      return;
    }
    
    async function fetchAlunosDaTurma() {
      setLoadingAlunos(true);
      setSelectedAlunoId(''); // Limpa a seleção de aluno anterior
      const { data, error } = await supabase
        .from('matriculas')
        .select('alunos(id, nome)')
        .eq('turma_id', selectedTurmaId);
      
      if (error) {
        console.error('Erro ao buscar alunos da turma:', error);
      } else if (data) {
        const alunosDaTurma = data.map(item => item.alunos).filter(Boolean) as Aluno[];
        setAlunos(alunosDaTurma);
      }
      setLoadingAlunos(false);
    }
    fetchAlunosDaTurma();
  }, [selectedTurmaId]);

  // Efeito 3: Buscar as notas sempre que um aluno for selecionado.
  useEffect(() => {
    if (!selectedAlunoId) {
      setNotas([]);
      return;
    }

    async function fetchNotasDoAluno() {
      setLoadingNotas(true);
      const { data, error } = await supabase
        .from('notas')
        .select('*')
        .eq('aluno_id', selectedAlunoId);

      if (error) {
        console.error('Erro ao buscar notas:', error);
      } else {
        setNotas(data || []);
      }
      setLoadingNotas(false);
    }
    fetchNotasDoAluno();
  }, [selectedAlunoId]);
  
  // Função para adicionar uma nova nota
  async function handleAdicionarNota(e: React.FormEvent) {
    e.preventDefault();
    if (!materia || !notaInput) {
      alert('Por favor, preencha a matéria e a nota.');
      return;
    }

    const valorNota = parseFloat(notaInput);
    if (isNaN(valorNota) || valorNota < 0 || valorNota > 10) {
      alert('A nota deve ser um número entre 0 e 10.');
      return;
    }

    const { data: novaNota, error } = await supabase
      .from('notas')
      .insert({
        aluno_id: selectedAlunoId,
        materia,
        nota: valorNota,
        data: dataSelecionada,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao adicionar nota:", error);
      alert("Ocorreu um erro ao adicionar a nota.");
    } else {
      setNotas(prevNotas => [...prevNotas, novaNota]);
      // Limpar campos do formulário
      setMateria('');
      setNotaInput('');
    }
  }

  if (loadingTurmas) {
    return <p>A carregar as suas turmas...</p>;
  }

  return (
    <div>
      <h2>Lançamento de Notas</h2>
      
      {turmas.length > 0 ? (
        <>
          <label htmlFor="turma-select">Selecione uma Turma:</label>
          <select 
            id="turma-select"
            value={selectedTurmaId} 
            onChange={e => setSelectedTurmaId(e.target.value)}
          >
            <option value="">-- Por favor, escolha uma turma --</option>
            {turmas.map(turma => (
              <option key={turma.id} value={turma.id}>{turma.nome}</option>
            ))}
          </select>

          {loadingAlunos && <p>A carregar alunos...</p>}
          
          {alunos.length > 0 && !loadingAlunos && (
            <div style={{ marginTop: '20px' }}>
              <label htmlFor="aluno-select">Selecione um Aluno:</label>
              <select 
                id="aluno-select"
                value={selectedAlunoId} 
                onChange={e => setSelectedAlunoId(e.target.value)}
              >
                <option value="">-- Por favor, escolha um aluno --</option>
                {alunos.map(aluno => (
                  <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
                ))}
              </select>
            </div>
          )}

          {selectedAlunoId && (
            <div style={{ marginTop: '30px' }}>
              <h3>Lançar nova nota para o aluno selecionado</h3>
              <form onSubmit={handleAdicionarNota}>
                <input
                  type="text"
                  placeholder="Matéria (ex: Matemática)"
                  value={materia}
                  onChange={e => setMateria(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Nota (0-10)"
                  value={notaInput}
                  onChange={e => setNotaInput(e.target.value)}
                  step="0.1"
                  min="0"
                  max="10"
                  required
                />
                <input
                  type="date"
                  value={dataSelecionada}
                  onChange={e => setDataSelecionada(e.target.value)}
                  required
                />
                <button type="submit">Adicionar Nota</button>
              </form>
              
              <h3 style={{ marginTop: '30px' }}>Notas Lançadas</h3>
              {loadingNotas ? <p>A carregar notas...</p> : (
                <ul>
                  {notas.length > 0 ? notas.map(nota => (
                    <li key={nota.id}>
                      {new Date(nota.data).toLocaleDateString()}: {nota.materia} - <strong>{nota.nota}</strong>
                    </li>
                  )) : (
                    <p>Nenhuma nota lançada para este aluno ainda.</p>
                  )}
                </ul>
              )}
            </div>
          )}
        </>
      ) : (
        <p>Não existem turmas associadas a si. Por favor, contacte um administrador.</p>
      )}
    </div>
  );
}
