'use client'

import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { STATUS_MAP, PRIORITY_MAP } from '@/constants/ticket'
import { Pencil, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'



type Ticket = {
  id: string
  title: string
  description: string
  status: keyof typeof STATUS_MAP
  priority: keyof typeof PRIORITY_MAP
  createdAt: string
  user?: {
    id: string
    name: string
  }
};

export function TicketList({ tickets }: { tickets: Ticket[] }) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const [filters, setFilters] = useState({
    user: '',
    status: '',
    priority: '',
  })

  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null)

  const users = useMemo(() => {
    const userMap = new Map()
    tickets.forEach((ticket) => {
      if (ticket.user?.id) {
        userMap.set(ticket.user.id, ticket.user.name)
      }
    })
    return Array.from(userMap, ([id, name]) => ({ id, name }))
  }, [tickets])

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesUser = !filters.user || ticket.user?.id === filters.user
      const matchesStatus = !filters.status || ticket.status === filters.status
      const matchesPriority = !filters.priority || ticket.priority === filters.priority
      return matchesUser && matchesStatus && matchesPriority
    })
  }, [tickets, filters])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleConfirmDelete = async () => {
  if (!ticketToDelete) return

  try {
    const res = await fetch(`/api/tickets/${ticketToDelete.id}`, {
      method: 'DELETE',
    })

    if (!res.ok) throw new Error('Erro ao excluir')

    toast.success('Ticket excluído com sucesso')
    setTicketToDelete(null)

    queryClient.invalidateQueries({ queryKey: ['tickets'] })
  } catch (error) {
    console.error(error)
    toast.error('Erro ao excluir o ticket')
  }
}

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface border border-border p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Usuário
          </label>
          <select
            name="user"
            value={filters.user}
            onChange={handleFilterChange}
            className="w-full p-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="">Todos</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full p-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="">Todos</option>
            {Object.entries(STATUS_MAP).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Prioridade
          </label>
          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="w-full p-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="">Todas</option>
            {Object.entries(PRIORITY_MAP).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contagem */}
      <div className="text-sm text-muted">
        {filteredTickets.length} {filteredTickets.length === 1 ? 'ticket encontrado' : 'tickets encontrados'}
      </div>

      {/* Lista de tickets */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-surface"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg text-foreground">{ticket.title}</h3>
                <p className="text-muted mt-1">{ticket.description}</p>
              </div>

              <div className="flex items-start space-x-2">
                <button
                  onClick={() => router.push(`/tickets/${ticket.id}/edit`)}
                  className="p-1 hover:bg-muted/10 dark:hover:bg-muted/20 rounded"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4 text-muted" />
                </button>
                <button
                  onClick={() => setTicketToDelete(ticket)}
                  className="p-1 hover:bg-muted/10 dark:hover:bg-muted/20 rounded"
                  title="Excluir"
                >
                  <Trash className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mt-3">
              <p className="text-sm text-muted">
                Criado por: {ticket.user?.name || 'Desconhecido'} •{' '}
                {new Date(ticket.createdAt).toLocaleDateString()}
              </p>

              <div className="flex space-x-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${ticket.status === 'ABERTO'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : ticket.status === 'EM_ANDAMENTO'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}
                >
                  {STATUS_MAP[ticket.status as keyof typeof STATUS_MAP]}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${ticket.priority === 'ALTA'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : ticket.priority === 'MEDIA'
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}
                >
                  {PRIORITY_MAP[ticket.priority as keyof typeof PRIORITY_MAP]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmação */}
      {ticketToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-surface p-6 rounded-lg shadow-lg w-[90%] max-w-sm border border-border">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Confirmar exclusão</h2>
            <p className="text-sm text-muted mb-6">
              Tem certeza que deseja excluir o ticket:{' '}
              <span className="font-medium text-foreground">{ticketToDelete.title}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setTicketToDelete(null)}
                className="px-4 py-2 text-muted hover:bg-muted/10 dark:hover:bg-muted/20 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
