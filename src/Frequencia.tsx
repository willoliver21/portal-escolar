import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

interface Aluno {
  id: string
  nome: string
}

interface Frequencia {
  aluno_id: string
  data: string
  presente: boolean
}

export function Frequencia() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [frequencias, setFrequencias] = useState<Record<string, boolean>>({})
  const [dataSelecionada, setDataSelecionada] = useState(() =>
    new Date().toISOString().slice(0, 10)
  )
  const [loading, setLoading] = useState(false)

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
    async function fetchFrequencias() {
      if (!dataSelecionada) return

      const { data: freqData, error } = await supabase
        .from('frequencias')
        .select('aluno_id, presente')
        .eq('data', dataSelecionada)

      if (error) {
        console.error(error)
      } else {
        const freqMap: Record<string, boolean> = {}
        freqData?.forEach(f => {
          freqMap[f.aluno_id] = f.presente
        })
        setFrequencias(freqMap)
      }
    }
    fetchFrequencias()
  }, [dataSelecionada])

  async function togglePresenca(aluno_id: string) {
    const presenteAtual = frequencias[aluno_id]
    const novoStatus = !presenteAtual

    setFrequencias(prev => ({ ...prev, [aluno_id]: novoStatus }))

    const { data: existente, error: errExistente } = await supabase
      .from('frequencias')
      .select('id')
      .eq('aluno_id', aluno_id)
      .eq('data', dataSelecionada)
      .single()

    if (errExistente && errExistente.code !== 'PGRST116') {
      console.error(errExistente)
      return
    }

    if (existente) {
      const { error } = await supabase
        .from('frequencias')
        .update({ presente: novoStatus })
        .eq('id', existente.id)
      if (error) console.error(error)
    } else {
      const { error } = await supabase
        .from('frequencias')
        .insert([{ aluno_id, data: dataSelecionada, presente: novoStatus }])
      if (error) console.error(error)
    }
  }

  return (
    <div>
      <h2>Frequência - {dataSelecionada}</h2>
      <input
        type="date"
        value={dataSelecionada}
        onChange={e => setDataSelecionada(e.target.value)}
      />
      {loading && <p>Carregando...</p>}
      <ul>
        {alunos.map(aluno => (
          <li key={aluno.id}>
            <label>
              <input
                type="checkbox"
                checked={!!frequencias[aluno.id]}
                onChange={() => togglePresenca(aluno.id)}
              />
              {aluno.nome}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
