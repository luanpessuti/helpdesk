import { CreateTicketForm } from '@/components/CreateTicketForm'

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-surface rounded-lg shadow border border-border p-6">
        <h1 className="text-2xl font-bold mb-6 text-primary">
          Criar Novo Ticket
        </h1>
        <CreateTicketForm />
      </div>
    </main>
  )
}
