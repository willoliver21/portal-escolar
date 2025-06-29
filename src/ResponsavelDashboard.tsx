import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

// Interfaces para os nossos tipos de dados
interface Nota {
  materia: string;
  nota: number;
  data: string;
}

interface Frequencia {
  data: string;
  presente: boolean;
}

interface AlunoData {
  aluno_nome: string;
  notas: Nota[];
  frequencias: Frequencia[];
}

export function ResponsavelDashboard() {
  const [alunoData, setAlunoData] = useState<AlunoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlunoData() {
      setLoading(true);
      
      // Primeiro, buscamos qual aluno está associado ao responsável logado.
      const { data: aluno, error: alunoError } = await supabase
        .from('alunos')
        .select('id, nome')
        .eq('responsavel_id', (await supabase.auth.getUser()).data.user?.id)
        .single();
        
      if (alunoError || !aluno) {
        console.error('Nenhum aluno encontrado para este responsável:', alunoError);
        setLoading(false);
        return;
      }
      
      // Com o ID do aluno, buscamos as suas notas e frequências em paralelo.
      const [notasResult, frequenciasResult] = await Promise.all([
        supabase.from('notas').select('materia, nota, data').eq('aluno_id', aluno.id),
        supabase.from('frequencias').select('data, presente').eq('aluno_id', aluno.id)
      ]);
      
      if (notasResult.error || frequenciasResult.error) {
        console.error('Erro ao buscar dados do aluno:', notasResult.error || frequenciasResult.error);
      } else {
        setAlunoData({
          aluno_nome: aluno.nome,
          notas: notasResult.data || [],
          frequencias: frequenciasResult.data || []
        });
      }
      
      setLoading(false);
    }
    
    fetchAlunoData();
  }, []);

  if (loading) {
    return <p>A carregar informações do aluno...</p>;
  }

  if (!alunoData) {
    return <p>Não foi possível encontrar os dados do aluno. Verifique se um aluno foi associado a si no sistema.</p>;
  }
  
  // Função para calcular estatísticas
  const totalFaltas = alunoData.frequencias.filter(f => !f.presente).length;
  const mediaGeral = alunoData.notas.length > 0
    ? (alunoData.notas.reduce((acc, n) => acc + n.nota, 0) / alunoData.notas.length).toFixed(1)
    : 'N/A';

  return (
    <div>
      <h2>Painel do Responsável</h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
        Acompanhe aqui o desempenho de <strong>{alunoData.aluno_nome}</strong>.
      </p>

      {/* Resumo do Desempenho */}
      <div className="stats-container">
        <div className="stat-card">
          <h4>Média Geral</h4>
          <p>{mediaGeral}</p>
        </div>
        <div className="stat-card">
          <h4>Total de Faltas</h4>
          <p>{totalFaltas}</p>
        </div>
      </div>
      
      {/* Detalhes de Notas e Frequências */}
      <div className="details-container">
        <div className="details-column">
          <h3>Últimas Notas Lançadas</h3>
          <ul>
            {alunoData.notas.slice(0, 5).map((nota, index) => (
              <li key={index}>
                <span>{nota.materia}</span>
                <span className={`nota-badge nota-${nota.nota >= 6 ? 'boa' : 'baixa'}`}>
                  {nota.nota.toFixed(1)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="details-column">
          <h3>Últimos Registos de Frequência</h3>
          <ul>
            {alunoData.frequencias.slice(0, 5).map((freq, index) => (
              <li key={index}>
                <span>{new Date(freq.data).toLocaleDateString()}</span>
                <span style={{ color: freq.presente ? '#4ade80' : '#f87171' }}>
                  {freq.presente ? 'Presente' : 'Falta'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
