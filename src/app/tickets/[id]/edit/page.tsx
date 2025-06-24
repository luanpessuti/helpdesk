'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Loading from '@/components/Loading'

export default function EditTicket() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { id } = params

  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const res = await fetch(`/api/tickets/${id}`)
      if (!res.ok) throw new Error('Erro ao carregar ticket')
      return res.json()
    },
    enabled: !!id,
  })

  type TicketUpdate = {
    title: string
    description: string
    status: string
    priority: string
  }

  const mutation = useMutation({
    mutationFn: async (updatedData: TicketUpdate) => {
      const res = await fetch(`/api/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      })
      if (!res.ok) throw new Error('Erro ao atualizar ticket')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      router.push('/dashboard')
    },
  })

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')

  useEffect(() => {
    if (ticket) {
      setTitle(ticket.title)
      setDescription(ticket.description)
      setStatus(ticket.status)
      setPriority(ticket.priority)
    }
  }, [ticket])

  if (isLoading) return <Loading message="Carregando ticket..." />
  if (error) return <p className="text-error">Erro ao carregar o ticket.</p>

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ title, description, status, priority })
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="bg-surface border border-border rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">
          Editar Ticket
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            className="w-full border border-border bg-background text-foreground p-3 rounded placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            required
          />

          <textarea
            className="w-full border border-border bg-background text-foreground p-3 rounded placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição"
            rows={4}
          />

          <select
            className="w-full border border-border bg-background text-foreground p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Status</option>
            <option value="ABERTO">Aberto</option>
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="FECHADO">Fechado</option>
          </select>

          <select
            className="w-full border border-border bg-background text-foreground p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="">Prioridade</option>
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
          </select>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {mutation.isPending ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>
    </main>
  )
}
