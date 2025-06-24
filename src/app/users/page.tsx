'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Pencil, Trash } from 'lucide-react'
import { toast } from 'sonner'
import Loading from '@/components/Loading'

type User = {
  id: string
  name: string
  email: string
}

export default function UsersPage() {
  const queryClient = useQueryClient()

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users')
      if (!res.ok) throw new Error('Erro ao carregar usuários')
      return res.json()
    },
  })

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const resetForm = () => {
    setName('')
    setEmail('')
    setEditingUserId(null)
  }

  const handleEdit = (user: User) => {
    setEditingUserId(user.id)
    setName(user.name)
    setEmail(user.email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) {
      toast.warning('Preencha todos os campos')
      return
    }

    if (editingUserId) {
      updateUser.mutate({ id: editingUserId, name, email })
    } else {
      createUser.mutate({ name, email })
    }
  }

  const createUser = useMutation({
    mutationFn: async (newUser: { name: string; email: string }) => {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })
      if (!res.ok) throw new Error('Erro ao criar usuário')
    },
    onSuccess: () => {
      toast.success('Usuário criado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      resetForm()
    },
    onError: () => toast.error('Erro ao criar usuário'),
  })

  const updateUser = useMutation({
    mutationFn: async ({ id, name, email }: { id: string; name: string; email: string }) => {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      if (!res.ok) throw new Error('Erro ao atualizar usuário')
    },
    onSuccess: () => {
      toast.success('Usuário atualizado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      resetForm()
    },
    onError: () => toast.error('Erro ao atualizar usuário'),
  })

  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erro ao excluir usuário')
    },
    onSuccess: () => {
      toast.success('Usuário excluído com sucesso')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setUserToDelete(null)
    },
    onError: () => toast.error('Erro ao excluir usuário'),
  })

  if (isLoading) return <Loading message="Carregando usuários..." />
  if (error) return <p className="text-error">Erro ao carregar usuários.</p>

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6 bg-surface border border-border rounded shadow">
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Gerenciar Usuários</h1>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border border-border bg-background text-foreground p-3 rounded placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full border border-border bg-background text-foreground p-3 rounded placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {editingUserId ? 'Salvar Edição' : 'Adicionar Usuário'}
          </button>
          {editingUserId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de usuários */}
      <div className="space-y-2">
        {users && users.length > 0 ? (
          users.map((user: User) => (
            <div
              key={user.id}
              className="flex items-center justify-between border border-border rounded p-4 shadow-sm bg-background"
            >
              <div>
                <p className="font-semibold text-foreground">{user.name}</p>
                <p className="text-sm text-muted">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </button>
                <button
                  onClick={() => setUserToDelete(user)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Excluir"
                >
                  <Trash className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">Nenhum usuário encontrado.</p>
        )}
      </div>

      {/* Modal de confirmação */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-surface border border-border p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Confirmar exclusão</h2>
            <p className="text-sm text-muted mb-6">
              Tem certeza que deseja excluir o usuário{' '}
              <span className="font-medium text-foreground">{userToDelete.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-foreground hover:bg-muted rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteUser.mutate(userToDelete.id)}
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
