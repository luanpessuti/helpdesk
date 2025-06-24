// app/api/tickets/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/tickets
export async function GET() {
  const tickets = await prisma.ticket.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(tickets)
}

// POST /api/tickets
export async function POST(req: Request) {
  const body = await req.json()
  const { title, description, userId, priority } = body

  if (!title || !description || !userId) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const newTicket = await prisma.ticket.create({
    data: {
      title,
      description,
      priority,
      status: body.status || 'OPEN',
      user: { connect: { id: userId } },
    },
  })

  return NextResponse.json(newTicket, { status: 201 })
}
