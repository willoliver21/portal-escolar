import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

// Interfaces para os nossos tipos de dados
interface Turma {
  id: string;
  nome: string;
}

interface Aluno {
  id: string;
  nome: string;
}

export function Frequencia() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>('');
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [frequencias, setFrequencias] = useState<Record<string, boolean>>({});
  const [dataSelecionada, setDataSelecionada] = useState(() => new Date().toISOString().slice(0, 10));
  
  const [loadingTurmas, setLoadingTurmas] = useState(true);
  const [loadingAlunos, setLoadingAlunos] = useState(false);

  // Efeito 1: Buscar as turmas do professor logado usando a nossa nova função.
  useEffect(() => {
    async function fetchTurmas() {
      setLoadingTurmas(true);
      
      // Chamamos a nossa função 'get_minhas_turmas' usando rpc().
      // Esta é a forma mais robusta e segura.
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

  // Efeito 2: Buscar os alunos da turma selecionada.
  useEffect(() => {
    if (!selectedTurmaId) {
      setAlunos([]);
      return;
    }

    async function fetchAlunos() {
      setLoadingAlunos(true);
      // Usamos a tabela 'matriculas' para encontrar os alunos da turma.
      const { data, error } = await supabase
        .from('matriculas')
        .select(`
          alunos ( id, nome )
        `)
        .eq('turma_id', selectedTurmaId);
      
      if (error) {
        console.error('Erro ao buscar alunos:', error);
      } else if (data) {
        const alunosDaTurma = data.map(item => item.alunos).filter(Boolean) as Aluno[];
        setAlunos(alunosDaTurma);
      }
      setLoadingAlunos(false);
    }
    fetchAlunos();
  }, [selectedTurmaId]);

  // Efeito 3: Buscar as frequências existentes para a data e alunos selecionados.
  useEffect(() => {
    async function fetchFrequencias() {
      if (!dataSelecionada || alunos.length === 0) {
        setFrequencias({});
        return;
      }

      const alunoIds = alunos.map(a => a.id);
      const { data, error } = await supabase
        .from('frequencias')
        .select('aluno_id, presente')
        .eq('data', dataSelecionada)
        .in('aluno_id', alunoIds);

      if (error) {
        console.error('Erro ao buscar frequências:', error);
      } else {
        const freqMap: Record<string, boolean> = {};
        data?.forEach(f => {
          freqMap[f.aluno_id] = f.presente;
        });
        setFrequencias(freqMap);
      }
    }
    fetchFrequencias();
  }, [dataSelecionada, alunos]);

  // Função para salvar a frequência (lógica de "upsert")
  async function togglePresenca(alunoId: string) {
    const presenteAtual = frequencias[alunoId] ?? false;
    const novoStatus = !presenteAtual;

    setFrequencias(prev => ({ ...prev, [alunoId]: novoStatus }));

    const { error } = await supabase
      .from('frequencias')
      .upsert(
        { aluno_id: alunoId, data: dataSelecionada, presente: novoStatus },
        { onConflict: 'aluno_id, data' }
      );

    if (error) {
      console.error('Erro ao salvar frequência:', error);
      // Reverter o estado em caso de erro
      setFrequencias(prev => ({ ...prev, [alunoId]: presenteAtual }));
    }
  }

  // Renderização do componente
  if (loadingTurmas) {
    return <p>A carregar as suas turmas...</p>;
  }

  return (
    <div>
      <h2>Registo de Frequência</h2>
      
      {turmas.length > 0 ? (
        <>
          <label htmlFor="turma-select">Selecione uma Turma:</label>
          <select 
            id="turma-select"
            value={selectedTurmaId} 
            onChange={e => setSelectedTurmaId(e.target.value)}
            style={{ marginBottom: '20px', display: 'block' }}
          >
            <option value="">-- Por favor, escolha uma opção --</option>
            {turmas.map(turma => (
              <option key={turma.id} value={turma.id}>{turma.nome}</option>
            ))}
          </select>

          {selectedTurmaId && (
            <>
              <label htmlFor="data-select">Data:</label>
              <input
                id="data-select"
                type="date"
                value={dataSelecionada}
                onChange={e => setDataSelecionada(e.target.value)}
                style={{ marginBottom: '20px', display: 'block' }}
              />
              {loadingAlunos ? <p>A carregar alunos...</p> : (
                <ul>
                  {alunos.map(aluno => (
                    <li key={aluno.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={frequencias[aluno.id] || false}
                          onChange={() => togglePresenca(aluno.id)}
                        />
                        {aluno.nome}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      ) : (
        <p>Não existem turmas associadas a si. Por favor, contacte um administrador.</p>
      )}
    </div>
  );
}
