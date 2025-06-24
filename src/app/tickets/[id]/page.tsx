'use client'

import { useRouter, useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Loading from '@/components/Loading'
import { STATUS_MAP, PRIORITY_MAP } from '@/constants/ticket'

export default function TicketDetails() {
  const params = useParams()
  const router = useRouter()
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

  if (isLoading) return <Loading message="Carregando ticket..." />
  if (error) return <p className="text-error">Erro ao carregar o ticket.</p>
  if (!ticket) return <p className="text-muted">Ticket não encontrado.</p>

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="bg-surface border border-border rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
          {ticket.title}
        </h1>

        <p className="mb-6 text-foreground whitespace-pre-line">
          {ticket.description}
        </p>

        <div className="space-y-2 text-sm text-muted">
          <p>
            <span className="font-medium text-foreground">Status:</span>{' '}
            {STATUS_MAP[ticket.status as keyof typeof STATUS_MAP] || ticket.status}
          </p>
          <p>
            <span className="font-medium text-foreground">Prioridade:</span>{' '}
            {PRIORITY_MAP[ticket.priority as keyof typeof PRIORITY_MAP] || ticket.priority}
          </p>
          <p>
            <span className="font-medium text-foreground">Criado por:</span>{' '}
            {ticket.user?.name || 'Desconhecido'}
          </p>
          <p>
            <span className="font-medium text-foreground">Criado em:</span>{' '}
            {new Date(ticket.createdAt).toLocaleString()}
          </p>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="mt-8 w-full sm:w-auto px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Voltar
        </button>
      </div>
    </main>
  )
}
