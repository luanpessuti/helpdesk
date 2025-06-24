'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { STATUS_MAP, PRIORITY_MAP } from '@/constants/ticket'

export function CreateTicketForm() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    userId: '',
    status: '',
    priority: '',
  })

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users')
      return res.json()
    },
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Erro ao criar ticket')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      setFormData({
        title: '',
        description: '',
        userId: '',
        status: '',
        priority: '',
      })
    },
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.userId) return alert('Selecione um usuário')
    mutation.mutate()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        name="userId"
        value={formData.userId}
        onChange={handleChange}
        className="w-full border border-border bg-background text-foreground p-3 rounded placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
        required
      >
        <option value="">Selecione um usuário</option>
        {users?.map((user: { id: string; name: string }) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      <input
        className="w-full border border-border bg-background text-foreground p-3 rounded placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Título"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <textarea
        className="w-full border border-border bg-background text-foreground p-3 rounded placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Descrição"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full border border-border bg-background text-foreground p-3 rounded placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
        required
      >
        <option value="">Selecione um status</option>
        {Object.entries(STATUS_MAP).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className="w-full border border-border bg-background text-foreground p-3 rounded placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
        required
      >
        <option value="">Selecione a prioridade</option>
        {Object.entries(PRIORITY_MAP).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-primary text-primary-foreground py-2 rounded hover:opacity-90 disabled:opacity-50 transition"
      >
        {mutation.isPending ? 'Enviando...' : 'Criar Ticket'}
      </button>

      {mutation.isSuccess && (
        <div className="mt-4 p-3 bg-success/20 text-success rounded">
          ✅ Ticket criado com sucesso!
        </div>
      )}
    </form>
  )
}
