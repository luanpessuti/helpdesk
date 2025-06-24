import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const [totalTickets, totalUsers, ticketsPorStatus, ticketsPorPrioridade] = await Promise.all([
      prisma.ticket.count(),
      prisma.user.count(),
      prisma.ticket.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.ticket.groupBy({
        by: ['priority'],
        _count: { priority: true },
      }),
    ])

    return NextResponse.json({
      totalTickets,
      totalUsers,
      ticketsPorStatus,
      ticketsPorPrioridade
    })
  } catch {
    return NextResponse.json(
      { error: 'Erro ao carregar dados do dashboard' },
      { status: 500 }
    )
  }
}