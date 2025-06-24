import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/tickets/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket não encontrado' }, { status: 404 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ 
      error: 'Erro ao buscar ticket',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

// PATCH /api/tickets/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    
    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
      },
    })

    return NextResponse.json(ticket)
  } catch (error) {
    console.error('PATCH Error:', error);
    return NextResponse.json({ 
      error: 'Erro ao atualizar ticket',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 400 })
  }
}

// DELETE /api/tickets/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.ticket.delete({
      where: { id },
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ 
      error: 'Erro ao deletar ticket',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 400 })
  }
}