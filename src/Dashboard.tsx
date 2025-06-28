import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface Aluno {
  id: string
  nome: string
}

interface Frequencia {
  aluno_id: string
  presente: boolean
}

export function Dashboard() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [frequencias, setFrequencias] = useState<Frequencia[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchDados() {
      setLoading(true)

      const { data: alunosData, error: alunosError } = await supabase
        .from('alunos')
        .select('id, nome')

      if (alunosError) {
        console.error(alunosError)
        setLoading(false)
        return
      }

      setAlunos(alunosData || [])

      const { data: freqData, error: freqError } = await supabase
        .from('frequencias')
        .select('aluno_id, presente')

      if (freqError) {
        console.error(freqError)
      } else {
        setFrequencias(freqData || [])
      }

      setLoading(false)
    }

    fetchDados()
  }, [])

  function prepararDadosParaGrafico() {
    return alunos.map(aluno => {
      const freqAluno = frequencias.filter(f => f.aluno_id === aluno.id)
      const presencas = freqAluno.filter(f => f.presente).length
      const total = freqAluno.length
      const percPresenca = total ? (presencas / total) * 100 : 0

      return {
        nome: aluno.nome,
        presenca: parseFloat(percPresenca.toFixed(1)),
      }
    })
  }

  // Logs para testar no console do navegador
  console.log("Alunos:", alunos)
  console.log("Frequencias:", frequencias)
  console.log("Dados para gráfico:", prepararDadosParaGrafico())

  return (
    <div>
      <h2>Dashboard - Presença dos Alunos</h2>
      {loading ? (
        <p>Carregando dados...</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={prepararDadosParaGrafico()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="presenca" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  )
}
