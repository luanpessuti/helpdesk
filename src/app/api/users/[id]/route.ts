import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params

  const user = await prisma.user.findUnique({ where: { id } })

  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params
  const data = await req.json()

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
      },
    })
    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 400 })
  }
}

export async function DELETE(_req: Request, context: Params) {
  const { id } = await context.params

  try {
    await prisma.user.delete({
      where: { id },
    })
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ error: 'Erro ao deletar usuário' }, { status: 400 })
  }
}