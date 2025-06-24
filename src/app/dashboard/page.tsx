'use client'

import { useQuery } from '@tanstack/react-query'
import { TicketList } from '@/components/TicketList'
import { STATUS_MAP, PRIORITY_MAP } from '@/constants/ticket'
import Loading from '@/components/Loading'

export default function Dashboard() {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard')
      if (!res.ok) throw new Error('Erro ao carregar dashboard')
      return res.json()
    },
  })

  const { data: ticketsData } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const res = await fetch('/api/tickets')
      return res.json()
    },
  })

  if (isLoading) return <Loading message="Carregando dashboard..." />
  if (error) return (
    <p className="text-error dark:text-error text-center font-medium mt-10">
      Erro ao carregar dados.
    </p>
  )

  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 text-foreground">
      {/* Seção de Métricas */}
      <section>
        <h1 className="text-2xl font-bold mb-6 text-primary">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card title="Total de Tickets" value={dashboardData?.totalTickets ?? 0} />
          <Card title="Total de Usuários" value={dashboardData?.totalUsers ?? 0} />

          {dashboardData?.ticketsPorStatus?.map((item: { status: string; _count: { status: number } }) => (
            <Card
              key={item.status}
              title={`Status: ${STATUS_MAP[item.status as keyof typeof STATUS_MAP] || item.status}`}
              value={item._count.status}
            />
          ))}

          {dashboardData?.ticketsPorPrioridade?.map((item: { priority: string; _count: { priority: number } }) => (
            <Card
              key={item.priority}
              title={`Prioridade: ${PRIORITY_MAP[item.priority as keyof typeof PRIORITY_MAP] || item.priority}`}
              value={item._count.priority}
            />
          ))}
        </div>
      </section>

      {/* Seção de Tickets */}
      <section className="bg-surface rounded-lg shadow p-6 border border-border">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Lista de Tickets</h2>
        <TicketList tickets={ticketsData} />
      </section>
    </main>
  )
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow hover:shadow-lg transition">
      <h3 className="text-sm text-muted mb-1">{title}</h3>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  )
}
