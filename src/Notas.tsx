import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

interface Nota {
  id: string
  aluno_id: string
  materia: string
  nota: number
  data: string
}

interface Aluno {
  id: string
  nome: string
}

export function Notas() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [notas, setNotas] = useState<Nota[]>([])
  const [materia, setMateria] = useState('')
  const [notaInput, setNotaInput] = useState('')
  const [alunoSelecionado, setAlunoSelecionado] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [dataSelecionada, setDataSelecionada] = useState(() =>
    new Date().toISOString().slice(0, 10)
  )

  useEffect(() => {
    async function fetchAlunos() {
      const { data: alunosData, error } = await supabase.from('alunos').select('id, nome')
      if (error) {
        console.error(error)
      } else {
        setAlunos(alunosData || [])
      }
    }
    fetchAlunos()
  }, [])

  useEffect(() => {
    async function fetchNotas() {
      if (!alunoSelecionado) {
        setNotas([])
        return
      }
      setLoading(true)
      const { data: notasData, error } = await supabase
        .from('notas')
        .select('*')
        .eq('aluno_id', alunoSelecionado)

      if (error) {
        console.error(error)
      } else {
        setNotas(notasData || [])
      }
      setLoading(false)
    }
    fetchNotas()
  }, [alunoSelecionado])

  async function handleAdicionarNota() {
    if (!alunoSelecionado || !materia || !notaInput) {
      alert('Preencha todos os campos')
      return
    }

    const valorNota = parseFloat(notaInput)
    if (isNaN(valorNota) || valorNota < 0 || valorNota > 10) {
      alert('Nota inválida. Deve ser número entre 0 e 10.')
      return
    }

    const { error } = await supabase.from('notas').insert([
      {
        aluno_id: alunoSelecionado,
        materia,
        nota: valorNota,
        data: dataSelecionada,
      },
    ])

    if (error) {
      console.error(error)
      alert('Erro ao adicionar nota')
    } else {
      alert('Nota adicionada com sucesso!')
      setMateria('')
      setNotaInput('')

      const { data: notasAtualizadas, error: erroNotas } = await supabase
        .from('notas')
        .select('*')
        .eq('aluno_id', alunoSelecionado)

      if (erroNotas) {
        console.error(erroNotas)
      } else {
        setNotas(notasAtualizadas || [])
      }
    }
  }

  return (
    <div>
      <h2>Notas dos Alunos</h2>

      <label>
        Selecionar aluno:
        <select
          value={alunoSelecionado ?? ''}
          onChange={e => setAlunoSelecionado(e.target.value)}
        >
          <option value="">-- Selecione --</option>
          {alunos.map(aluno => (
            <option key={aluno.id} value={aluno.id}>
              {aluno.nome}
            </option>
          ))}
        </select>
      </label>

      {alunoSelecionado && (
        <>
          <h3>Lançar nova nota</h3>
          <label>
            Matéria:
            <input
              type="text"
              value={materia}
              onChange={e => setMateria(e.target.value)}
              placeholder="Ex: Matemática"
            />
          </label>
          <br />
          <label>
            Nota (0-10):
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={notaInput}
              onChange={e => setNotaInput(e.target.value)}
            />
          </label>
          <br />
          <label>
            Data:
            <input
              type="date"
              value={dataSelecionada}
              onChange={e => setDataSelecionada(e.target.value)}
            />
          </label>
          <br />
          <button onClick={handleAdicionarNota}>Adicionar Nota</button>

          <h3>Notas lançadas</h3>
          {loading && <p>Carregando notas...</p>}
          <ul>
            {notas.map(nota => (
              <li key={nota.id}>
                {nota.materia} - {nota.nota} ({nota.data})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
